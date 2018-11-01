const Octokit = require('@octokit/rest')

/**
 * 
 * @param {string} owner Owner of repo
 * @param {string} repo Name of repo
 * @param {string} token Authentication token
 * @param {string} branch Branch
 * @param {string} path Path of File
 */
const GithubRepo = ({
    owner, token
}) => {
    if (!token) {
        throw new Error('No token is defined')
    }

    const octokit = new Octokit()

    octokit.authenticate({
        type: 'token',
        token
    })

    const getBranches = (repo) => octokit.repos.getBranches({
        owner, repo
    }).then(_ => _.data)

    return {
        getBranches
    }
}

module.exports.GithubRepo = exports.GithubRepo = GithubRepo