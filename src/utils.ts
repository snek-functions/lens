import type {SpawnOptionsWithoutStdio} from 'child_process'

export async function spawnChild(
  command: string,
  scriptName: string,
  args?: string[],
  options?: SpawnOptionsWithoutStdio
) {
  const {spawn} = await import('child_process')
  const {fileURLToPath} = await import('url')
  const {default: path, dirname} = await import('path')

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  // filepath relative to current file
  const scriptPath = path.resolve(__dirname, scriptName)

  const child = spawn(command, [scriptPath].concat(args || []), options)

  let data = ''
  for await (const chunk of child.stdout) {
    console.log('stdout chunk: ' + chunk)
    data += chunk
  }
  let error = ''
  for await (const chunk of child.stderr) {
    console.error('stderr chunk: ' + chunk)
    error += chunk
  }
  const exitCode = await new Promise((resolve, _) => {
    child.on('close', resolve)
  })

  if (exitCode) {
    throw new Error(`subprocess error exit ${exitCode}, ${error}`)
  }
  return data
}
