require('dotenv').config()

const GithubFile = require('./github-file.js').GithubFile

describe('GithubFile', () => {
    it('should load env variable', () => {
        expect(process.env.GITHUB_OWNER).toBeTruthy()
        expect(process.env.GITHUB_REPO).toBeTruthy()
        expect(process.env.GITHUB_BRANCH).toBeTruthy()
        expect(process.env.GITHUB_TOKEN).toBeTruthy()
    })

    const folder = 'github-file'

    const path = Math.random().toString(36).substring(2, 15) + '.story'

    const config = {
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        branch: process.env.GITHUB_BRANCH,
        token: process.env.GITHUB_TOKEN,
        path,
        folder
    }

    const githubFile = GithubFile(config)

    it('should throw Error for insufficient elements', async () => {
        expect(() => GithubFile({
            ...config,
            path: null
        })).toThrowError()

        expect(() => GithubFile({
            ...config,
            token: null
        })).toThrowError()
    })


    it('should not be able to read content of file', async () => {
        await githubFile.readContent()
            .then(
                _ => expect(true).toBeFalsy(),
                e => {
                    expect(JSON.parse(e.message).message).toBe('Not Found')
                }
            )
    })

    const content = 'Hello World'

    it('should create a file', async () => {
        await githubFile.create(
            content,
            new Date()
        ).then(
            response => {
                expect(response.data).toBeTruthy()
            },
            e => expect(e.message).toBeFalsy()
        )

        await githubFile.readContent()
        .then(
            response => expect(response).toBe(content),
            e => expect(e.message).toBeFalsy()
        )
    })

    const content2 = 'Hello World 2'

    it('should update the file', async () => {
        await githubFile.update(
            content2,
            new Date()
        ).then(
            async response => {
                expect(response.data).toBeTruthy()
            },
            e => expect(e.message).toBeFalsy()
        )


    })

    it('should update the file', async () => {
        await githubFile.readContent()
        .then(
            response => expect(response).toBe(content2),
            e => expect(e.message).toBeFalsy()
        )
                
    })

    it('should delete the file', async () => {
        await githubFile.delete(
            new Date()
        ).then(
            response => {
                expect(response.data).toBeTruthy()
            },
            e => expect(e.message).toBeFalsy()
        )
    })

    it('should not find  the file', async () => {
        await githubFile.readContent()
        .then(
            _ => expect(true).toBeFalsy(),
            e => {
                expect(JSON.parse(e.message).message).toBe('Not Found')
            }
        )
    })
})
