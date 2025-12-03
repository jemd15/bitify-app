import {useCallback, useMemo} from 'react'
import Graphemer from 'graphemer'

export function enforceLen(
  str: string,
  len: number,
  ellipsis = false,
  mode: 'end' | 'middle' = 'end',
): string {
  str = str || ''
  if (str.length > len) {
    if (ellipsis) {
      if (mode === 'end') {
        return str.slice(0, len) + '…'
      } else if (mode === 'middle') {
        const half = Math.floor(len / 2)
        return str.slice(0, half) + '…' + str.slice(-half)
      } else {
        // fallback
        return str.slice(0, len)
      }
    } else {
      return str.slice(0, len)
    }
  }
  return str
}

export function useEnforceMaxGraphemeCount() {
  const splitter = useMemo(() => new Graphemer(), [])

  return useCallback(
    (text: string, maxCount: number) => {
      if (splitter.countGraphemes(text) > maxCount) {
        return splitter.splitGraphemes(text).slice(0, maxCount).join('')
      } else {
        return text
      }
    },
    [splitter],
  )
}

export function countLines(str: string | undefined): number {
  if (!str) return 0
  return str.match(/\n/g)?.length ?? 0
}

