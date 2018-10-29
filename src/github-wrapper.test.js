require('dotenv').config()

const GithubWrapper = require('./github-wrapper.js').GithubWrapper

describe('GithubWrapper', async () => {
    it('should load env variable', async () => {
        expect(process.env.GITHUB_OWNER).toBeTruthy()
        expect(process.env.GITHUB_REPO).toBeTruthy()
        expect(process.env.GITHUB_BRANCH).toBeTruthy()
        expect(process.env.GITHUB_TOKEN).toBeTruthy()
    })

    const config = {
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        branch: process.env.GITHUB_BRANCH,
        token: process.env.GITHUB_TOKEN,
        configFile: 'config.json'
    }

    it('should init wrapper', async () => {
        const githubWrapper = await GithubWrapper(config)

        expect(githubWrapper).toBeTruthy()
    })

    it('should fail without correct configFile', async () => {
        await GithubWrapper({
            ...config,
            configFile: 'config.wrong.json'
        }).then(
            _ => expect(true).toBeFalsy(),
            e => expect(e).toBeTruthy()
        )

        await GithubWrapper({
            ...config,
            configFile: 'README.md'
        }).then(
            _ => expect(true).toBeFalsy(),
            e => expect(e).toBeTruthy()
        )

        await GithubWrapper({
            ...config,
            configFile: 'does-not-exist-file'
        }).then(
            _ => expect(true).toBeFalsy(),
            e => expect(e).toBeTruthy()
        )
     })


    it('should read have a root and content', async () => {
        const githubWrapper = await GithubWrapper(config)

        expect(githubWrapper.root).toBeTruthy()
     })

    it('should read all files', async () => {
        const githubWrapper = await GithubWrapper(config)
        
       await githubWrapper.getAllFiles().then(
           x => {
                expect(x.length).toBe(3)
           },
           e => expect(e).toBeFalsy()
       )
    })

    it('should read a specific file', async () => {
        const githubWrapper = await GithubWrapper(config)

        const content = await githubWrapper.file(`${githubWrapper.root}/9eoxzeeey1.story`).readContent()

        expect(content).toBe('Hello World 2')
    })
})
