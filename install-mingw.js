var wshell = new ActiveXObject("WScript.Shell")
var htmldoc = new ActiveXObject("htmlfile")
var xmlhttp = new ActiveXObject("MSXML2.ServerXMLHTTP")
var adodb = new ActiveXObject("ADODB.Stream")
var FSO = new ActiveXObject("Scripting.FileSystemObject")

function http_get(url, is_binary)
{
    xmlhttp.open("GET", url)
    xmlhttp.send()
    WScript.echo("retrieving " + url)
    while (xmlhttp.readyState != 4)
        WScript.Sleep(100)
    if (xmlhttp.status != 200) {
        WScript.Echo("http get failed: " + xmlhttp.status)
        WScript.Quit(2)
    }
    return is_binary ? xmlhttp.responseBody : xmlhttp.responseText
}

function url_decompose_filename(url)
{
    return url.split('/').pop().split('?').shift()
}

function save_binary(path, data)
{
    adodb.type = 1
    adodb.open()
    adodb.write(data)
    adodb.saveToFile(path, 2)
}

function pick_from_sf_file_list(html, cond)
{
    htmldoc.open()
    htmldoc.write(html)
    var tr = htmldoc.getElementById("files_list").getElementsByTagName("tr")
    for (var i = 0; i < tr.length; ++i) {
        title = tr[i].title
        if (cond(title))
            return title
    }
    return null
}

function download_mingw_get()
{
    var base_url = "http://sourceforge.net/projects/mingw/" +
                   "files/Installer/mingw-get/"
    var html = http_get(base_url, false)
    var project_name = pick_from_sf_file_list(html, function(title) {
        return title.indexOf("mingw-get") >= 0;
    })
    var project_url = base_url + project_name + "/"
    html = http_get(project_url, false)
    var dlp_name = pick_from_sf_file_list(html, function(title) {
        return title.indexOf("bin.zip") >= 0;
    })
    var dlp_url = project_url + dlp_name + "/download"
    html = http_get(dlp_url, false)
    htmldoc.open()
    htmldoc.write(html)
    var div = htmldoc.getElementById("downloading")
    var url = div.getElementsByTagName("a")[1].href
    var filename = url.split('/').pop().split('?').shift()
    var installer_data = http_get(url, true)
    save_binary(filename, installer_data)
    return FSO.GetAbsolutePathName(filename)
}

function extract_zip(zip_file, dstdir)
{
    var shell = new ActiveXObject("shell.application")
    var dst = shell.NameSpace(dstdir)
    var zipdir = shell.NameSpace(zip_file)
    dst.CopyHere(zipdir.items(), 0)
}

function install_mingw(zip_file, packages)
{
    var rootdir = wshell.CurrentDirectory

    extract_zip(zip_file, rootdir)

    wshell.Run("bin\\mingw-get install " + packages, 10, true)

    var fstab = FSO.GetAbsolutePathName("msys\\1.0\\etc\\fstab")
    var fp = FSO.CreateTextFile(fstab, true)
    fp.WriteLine(rootdir.replace(/\\/g,"/") + "\t/mingw")
    fp.Close()

    FSO.GetFile(zip_file).Delete()
}

var packages = "mingw32-base mingw32-gcc-g++ msys-make msys-wget msys-unzip"
install_mingw(download_mingw_get(), packages)
