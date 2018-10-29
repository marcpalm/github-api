const GithubFile = require('./github-file.js').GithubFile

const GithubWrapper = async ({
    owner, repo, token, branch, configFile
}) => {

    const config = {
        owner, repo, token, branch,
    }

    const configurationRaw = await GithubFile({
        ...config,
        path: configFile
    }).readContent()


    const configuration = JSON.parse(configurationRaw)

    if (!configuration.root) {
        throw new Error(`Configuration file at ${configFile}`)
    }

    const root = configuration.root

    const getAllFiles = () => GithubFile({
        ...config,
        path: root
    })  
        .read()
        .then(response => response.data
            .filter(_ => _.type === 'file' && _.name.endsWith('story'))
        )

    return {
        file: (path) => GithubFile({
            ...config,
            path
        }),
        getAllFiles,
        root
    }
}

module.exports.GithubWrapper = exports.GithubWrapper = GithubWrapper
