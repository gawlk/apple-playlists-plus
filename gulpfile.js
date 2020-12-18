const del = require('del')
const favicons = require('favicons')
const fs = require('fs')
const gulp = require('gulp')
const inject = require('gulp-inject')
const replace = require('gulp-string-replace')

const faviconsConfig = require('./gulp/favicons.json')
const packageJson = require('./package.json')

const updateServiceWorker = () => {
    const root = 'dist'

    const skip = ['favicons']

    const flatDeep = (arr) =>
        arr.reduce(
            (acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val) : val),
            []
        )

    const tree = (root) =>
        fs
            .readdirSync(root, { withFileTypes: true })
            .filter(
                (element) =>
                    !skip.includes(element.name) &&
                    !element.name.endsWith('.map')
            )
            .map((element) =>
                element.isDirectory()
                    ? tree(`${root}/${element.name}`)
                    : `${root}/${element.name}`
            )

    const listAllFiles = flatDeep(
        fs
            .readdirSync(root, { withFileTypes: true })
            .filter((dir) => dir.isDirectory() && !skip.includes(dir.name))
            .map((dir) => tree(`${root}/${dir.name}`))
    ).map((path) => path.substring(root.length))

    const filesToPreCache = ['/', '/index.html', ...listAllFiles]

    return gulp
        .src(`${root}/sw.js`)
        .pipe(
            replace(
                /'cache-.*'/,
                `'cache-${packageJson.name}-${(+new Date()).toString(36)}'`
            )
        )
        .pipe(
            replace(
                /filesToPreCache = .*/,
                `filesToPreCache = [\n    '${filesToPreCache.join(
                    "',\n    '"
                )}'\n]`
            )
        )
        .pipe(gulp.dest(root))
}
exports.updateServiceWorker = updateServiceWorker

const generateFavicons = () => {
    faviconsConfig.appName = faviconsConfig.appName || packageJson.name
    faviconsConfig.appShortName =
        faviconsConfig.appShortName ||
        faviconsConfig.appName ||
        packageJson.name
    faviconsConfig.appDescription = packageJson.description
    faviconsConfig.developerName = packageJson.author.name
    faviconsConfig.developerURL = packageJson.author.url
    faviconsConfig.version = packageJson.version
    faviconsConfig.url = packageJson.homepage

    return gulp
        .src('public/favicon.*')
        .pipe(favicons.stream(faviconsConfig))
        .pipe(gulp.dest(`dist${faviconsConfig.path}`))
}
exports.generateFavicons = generateFavicons

const injectFavicons = () => {
    return gulp
        .src('dist/index.html')
        .pipe(
            inject(
                gulp.src([`dist${faviconsConfig.path}${faviconsConfig.html}`]),
                {
                    starttag: '<!-- inject:favicons -->',
                    transform: (filepath, file) => {
                        return file.contents.toString()
                    },
                }
            )
        )
        .pipe(gulp.dest('dist'))
}
exports.injectFavicons = injectFavicons

const cleanFaviconsHTML = () => {
    return del(['dist/favicons/*.html'])
}
exports.cleanFaviconsHTML = cleanFaviconsHTML

exports.default = gulp.series(
    generateFavicons,
    injectFavicons,
    cleanFaviconsHTML,
    updateServiceWorker
)
