import { Command } from '@gosen/command-types'

type TreeNode = { [hash: string]: TreeNode }

const diff = (oldState: Command[], newState: Command[]): Command[] => {
  const oldOnce = new Set<string>()
  const oldRoutineNodes: Record<number, TreeNode> = {}
  const root: TreeNode = {}

  oldRoutineNodes[0] = root

  for (const command of oldState) {
    if ('once' in command && command.once) {
      oldOnce.add(command.hash)
      continue
    }

    if ('startRoutine' in command) {
      oldRoutineNodes[command.startRoutine] = oldRoutineNodes[command.routine || 0] || root
      continue
    }

    let hash = ''
    if ('hash' in command) {
      hash = command.hash
    } else if ('run' in command) {
      hash = command.run
    }

    let node = oldRoutineNodes[command.routine || 0] || root
    node[hash] = node[hash] || {}
    oldRoutineNodes[command.routine || 0] = node[hash]
  }

  const result: Command[] = []
  const routineNodes: Record<number, TreeNode> = {}

  routineNodes[0] = root

  for (const command of newState) {
    if ('once' in command && command.once) {
      if (!oldOnce.has(command.hash)) {
        result.push(command)
      }

      continue
    }

    if ('startRoutine' in command) {
      routineNodes[command.startRoutine] = routineNodes[command.routine || 0]
      result.push(command)
      continue
    }

    if (!routineNodes[command.routine || 0]) {
      result.push(command)
      continue
    }

    let hash = ''

    if ('hash' in command) {
      hash = command.hash
    } else if ('run' in command) {
      hash = command.run
    }

    routineNodes[command.routine || 0] = (routineNodes[command.routine || 0] || {})[hash]
    if (!routineNodes[command.routine || 0]) {
      result.push(command)
      continue
    }
  }

  return result
}

export default diff
