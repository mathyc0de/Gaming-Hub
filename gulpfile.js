var gulp = require('gulp');
var winInstaller = require('electron-winstaller');
const linuxInstaller = require('electron-installer-debian')
 

gulp.task('create-windows-installer', function (done) {
    winInstaller.createWindowsInstaller({
        appDirectory: './node_modules/electron/dist',
        outputDirectory: './release',
        arch: 'ia32',
        authors: "Syncfusion",
        version: "1.0.0",
        iconUrl: "favicon.ico",
        setupIcon: "favicon.ico",
        loadingGif: "ele.gif",
        noMsi:true
    }).then().catch();


gulp.task('create-linux-installer', async function(done) {
    
const options = {
  src: 'dist/app-linux-x64/',
  dest: 'dist/installers/',
  arch: 'amd64'
}

await installer(options)

})

});