(function () {
    function Downloader() {
        this.shell = new ActiveXObject("shell.application")
        this.wshell = new ActiveXObject("WScript.Shell")
        this.FSO = new ActiveXObject("Scripting.FileSystemObject")
    }

    Downloader.prototype.http_get = function(url, is_binary) {
        var xmlhttp = new ActiveXObject("MSXML2.ServerXMLHTTP")
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

    Downloader.prototype.binary_as_string = function(data) {
        var stream = new ActiveXObject("ADODB.Stream")
        stream.type = 1
        stream.open()
        stream.write(data)
        stream.position = 0
        stream.type = 2
        stream.charset = 'iso-8859-1'
        return stream.readtext()
    }

    Downloader.prototype.save_binary = function(path, data) {
        var stream = new ActiveXObject("ADODB.Stream")
        stream.type = 1
        stream.open()
        stream.write(data)
        stream.saveToFile(path, 2)
    }

    Downloader.prototype.open_html = function(html) {
        var htmldoc = new ActiveXObject("htmlfile")
        htmldoc.open()
        htmldoc.write(html)
        return htmldoc
    }

    Downloader.prototype.pick_from_sf_file_list = function(html, cond) {
        var htmldoc = this.open_html(html)
        var tr = htmldoc.getElementById("files_list").getElementsByTagName("tr")
        for (var i = 0; i < tr.length; ++i) {
            title = tr[i].title
            if (cond(title))
                return title
        }
        throw new Error("files_list not found")
    }

    Downloader.prototype.download_mingw_get = function() {
        var base_url = "http://sourceforge.net/projects/mingw/files/Installer/mingw-get/"
        var html = this.http_get(base_url, false)
        var project_name = this.pick_from_sf_file_list(html, function(title) {
            return title.indexOf("mingw-get") >= 0;
        })
        var project_url = base_url + project_name + "/"
        html = this.http_get(project_url, false)
        var dlp_name = this.pick_from_sf_file_list(html, function(title) {
            return title.indexOf("bin.zip") >= 0;
        })
        var dlp_url = project_url + dlp_name + "/download"
        html = this.http_get(dlp_url, false)
        var htmldoc = this.open_html(html)
        var p = htmldoc.getElementById("problems")
        var url = p.getElementsByTagName("a")[0].href
        if (0) {
            var params = url.split('?').pop().split('&')
            var mirror = null
            for (var i = 0; i < params.length; ++i) {
                kv = params[i].split('=')
                if (kv[0] == 'use_mirror') mirror = kv[1]
            }
            if (mirror == null)
                throw new Error("mirror not found")
            var url = project_url.replace(/(?=sourceforge.net)/, mirror + ".dl.") + dlp_name
        }
        var rawdata = this.http_get(url, true)
        var sdata = this.binary_as_string(rawdata)
        if (sdata.substring(0, 2) != 'PK') {
            throw new Error("couldn't retrieve a zip file")
        }
        this.save_binary(dlp_name, rawdata)
        return this.FSO.GetAbsolutePathName(dlp_name)
    }

    Downloader.prototype.extract_zip = function(zip_file, dstdir) {
        var dst = this.shell.NameSpace(dstdir)
        var zipdir = this.shell.NameSpace(zip_file)
        dst.CopyHere(zipdir.items(), 0)
    }

    Downloader.prototype.install_mingw = function(zip_file, packages) {
        var rootdir = this.wshell.CurrentDirectory
        zip_file = this.FSO.GetAbsolutePathName(zip_file)
        this.extract_zip(zip_file, rootdir)
        this.wshell.Run(rootdir + "\\bin\\mingw-get install " + packages, 10, true)
        var fstab = rootdir + "\\msys\\1.0\\etc\\fstab"
        var fp = this.FSO.CreateTextFile(fstab, true)
        fp.WriteLine(rootdir.replace(/\\/g,"/") + "\t/mingw")
        fp.Close()
        this.FSO.GetFile(zip_file).Delete()
    }

    var packages = "mingw32-base mingw32-gcc-g++ mingw32-pthreads-w32 msys-make msys-wget msys-zip msys-unzip"
    var downloader = new Downloader()
    var it = null;
    if (WScript.Arguments.length == 0) {
        it = downloader.download_mingw_get()
    } else {
        it = WScript.Arguments(0)
    }
    downloader.install_mingw(it, packages)
})()
