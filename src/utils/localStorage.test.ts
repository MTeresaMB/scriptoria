import { describe, it, expect, beforeEach } from 'vitest'
import {
  readLocalStorage,
  writeLocalStorage,
  readLocalStorageJson,
  writeLocalStorageJson,
  removeLocalStorage,
} from './localStorage'

describe('localStorage helpers', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('read/write string round-trip', () => {
    expect(writeLocalStorage('k', 'v')).toBe(true)
    expect(readLocalStorage('k')).toBe('v')
  })

  it('readLocalStorage returns null for missing key', () => {
    expect(readLocalStorage('missing')).toBeNull()
  })

  it('readLocalStorageJson parses objects and returns null on invalid JSON', () => {
    writeLocalStorage('j', '{"a":1}')
    expect(readLocalStorageJson<{ a: number }>('j')).toEqual({ a: 1 })

    writeLocalStorage('bad', 'not-json{')
    expect(readLocalStorageJson('bad')).toBeNull()
  })

  it('readLocalStorageJson returns null when value is empty', () => {
    expect(readLocalStorageJson('empty')).toBeNull()
  })

  it('writeLocalStorageJson stringifies values', () => {
    expect(writeLocalStorageJson('obj', { x: true })).toBe(true)
    expect(localStorage.getItem('obj')).toBe('{"x":true}')
  })

  it('removeLocalStorage removes key', () => {
    writeLocalStorage('rm', '1')
    expect(removeLocalStorage('rm')).toBe(true)
    expect(readLocalStorage('rm')).toBeNull()
  })
})
