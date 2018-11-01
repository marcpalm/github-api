require('dotenv').config()

const GithubRepo = require('./github-repo.js').GithubRepo

describe('GithubRepo', () => {
    it('should load env variable', () => {
        expect(process.env.GITHUB_OWNER).toBeTruthy()
        expect(process.env.GITHUB_TOKEN).toBeTruthy()
    })
         
    const config = {
        owner: process.env.GITHUB_OWNER,
        token: process.env.GITHUB_TOKEN
    }

    const githubRepo = GithubRepo(config)

    it('should throw Error for insufficient elements', async () => {
        expect(() => GithubRepo({
            ...config,
            token: null
        })).toThrowError()
    })

    it('should get all branches', async () => {
        expect(process.env.GITHUB_REPO).toBeTruthy()

        const repo = process.env.GITHUB_REPO
        const branches = await githubRepo.getBranches(repo)
        const sortedListOfBranches = branches.map(_ => _.name).sort()

        expect(process.env.GITHUB_BRANCH).toBeTruthy()
        expect(sortedListOfBranches).toEqual([ 'master', process.env.GITHUB_BRANCH ])
    })
})
