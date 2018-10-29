const Octokit = require('@octokit/rest')
const octokit = new Octokit()

/**
 * 
 * @param {string} owner Owner of repo
 * @param {string} repo Name of repo
 * @param {string} token Authentication token
 * @param {string} branch Branch
 * @param {string} path Path of File
 */
const GithubFile = ({
    owner, repo, token, branch, path, folder
}) => {
    if (!path) {
        throw new Error('No path is defined')
    }

    path = folder ? folder + '/' + path : path

    if (!token) {
        throw new Error('No token is defined')
    }

    octokit.authenticate({
        type: 'token',
        token
    })

    const read = () => octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch
    })

    const readContent = () => read().then(response => Buffer.from(response.data.content, 'base64').toString())

    const getCurrentSha = () => read().then(response => response.data.sha)

    const create = (content, message) => octokit.repos.createFile({
        owner,
        repo,
        path,
        message,
        branch,
        content: Buffer.from(content).toString('base64') // base64-encoded "bleep bloop"
    })

    const update = (content, message) => getCurrentSha().then(sha => {
        return octokit.repos.updateFile({
            owner,
            repo,
            path,
            message,
            branch,
            sha,
            content: Buffer.from(content).toString('base64') // base64-encoded "bleep bloop"
        })
    })

    const deleteFile = message => getCurrentSha().then(sha => {
        return octokit.repos.deleteFile({
            owner,
            repo,
            path,
            branch,
            message,
            sha
        })
    })

    return {
        read,
        readContent,
        create,
        update,
        delete: deleteFile
    }

}

exports.GithubFile = GithubFile
