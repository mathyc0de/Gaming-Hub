var gulp = require('gulp');
var winInstaller = require('electron-winstaller');
 

gulp.task('create-windows-installer', async function (done) {
    await winInstaller.createWindowsInstaller({
        appDirectory: './dist/gaming_hub-win32-x64',
        outputDirectory: './release',
        arch: 'x64',
        authors: "Syncfusion",
        version: "1.0.0",
        // iconUrl: "./src/assets/icons/icon.png",
        // setupIcon: "./src/assets/icons/icon.png",
        // loadingGif: "ele.gif",
        noMsi:false
    })


gulp.task('create-linux-installer', async function(done) {
    
const options = {
  src: 'dist/app-linux-x64/',
  dest: 'dist/installers/',
  arch: 'amd64'
}

await installer(options)

})

});