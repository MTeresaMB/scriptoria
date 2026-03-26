import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Character } from '@/types'

const mockGetUser = vi.fn()
const mockInsertCharacter = vi.fn()
const mockUpdateCharacter = vi.fn()

const toastError = vi.fn()
const toastSuccess = vi.fn()

vi.mock('@lib/supabase', () => ({
  supabase: {
    auth: { getUser: mockGetUser },
  },
}))

vi.mock('@lib/repository/charactersRepository', () => ({
  insertCharacter: mockInsertCharacter,
  updateCharacter: mockUpdateCharacter,
}))

vi.mock('@/hooks/ui/useToast', () => ({
  useToast: () => ({
    toast: {
      success: toastSuccess,
      error: toastError,
      warning: vi.fn(),
      info: vi.fn(),
    },
  }),
}))

describe('useCharacterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockReset()
    mockInsertCharacter.mockReset()
    mockUpdateCharacter.mockReset()
  })

  it('does not submit when name is too short', async () => {
    const { useCharacterForm } = await import('./useCharacterForm.ts')

    const onSuccess = vi.fn()
    const { result } = renderHook(() => useCharacterForm({ onSuccess }))

    const input = document.createElement('input')
    input.type = 'text'
    input.name = 'name'
    input.value = 'A'

    await act(async () => {
      await result.current.handleInputChange(
        { target: input } as unknown as React.ChangeEvent<HTMLInputElement>,
      )
    })

    await act(async () => {
      await result.current.handleSubmit(
        { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>,
      )
    })

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Please fix the errors before submitting')
    })

    expect(mockGetUser).not.toHaveBeenCalled()
    expect(mockInsertCharacter).not.toHaveBeenCalled()
    expect(result.current.fieldErrors.name).toBe('Name must be at least 2 characters')
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('inserts character when form is valid', async () => {
    const { useCharacterForm } = await import('./useCharacterForm.ts')

    const onSuccess = vi.fn()

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })

    mockInsertCharacter.mockResolvedValue({
      data: { id_character: 5, name: 'Hero' },
      error: null,
    })

    const { result } = renderHook(() => useCharacterForm({ onSuccess }))

    const input = document.createElement('input')
    input.type = 'text'
    input.name = 'name'
    input.value = 'Hero'

    await act(async () => {
      await result.current.handleInputChange(
        { target: input } as unknown as React.ChangeEvent<HTMLInputElement>,
      )
    })

    await act(async () => {
      await result.current.handleSubmit(
        { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>,
      )
    })

    await waitFor(() => expect(mockInsertCharacter).toHaveBeenCalled())
    expect(toastSuccess).toHaveBeenCalledWith('Character created successfully')
    expect(onSuccess).toHaveBeenCalled()
  })

  it('updates character when initialData is provided', async () => {
    const { useCharacterForm } = await import('./useCharacterForm.ts')

    const onSuccess = vi.fn()

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })

    mockUpdateCharacter.mockResolvedValue({
      data: { id_character: 1, name: 'Updated character' },
      error: null,
    })

    const initialData = {
      id_character: 1,
      name: 'Old character',
      biography: null,
      role: null,
      date_created: new Date().toISOString(),
      flaw: null,
      external_motivation: null,
      internal_motivation: null,
      positive_traits: null,
      negative_traits: null,
      quirks_mannerisms: null,
      fears_phobias: null,
      motto: null,
      birth: null,
      height: null,
      weight: null,
      build: null,
      hair_color: null,
      hair_style: null,
      eye_color: null,
      eye_shape: null,
      id_manuscript: 1,
      picture: null,
      age: null,
      occupation: null,
      relationship_status: null,
      personality_type: null,
      scars: null,
      id_user: 'user-1',
    } as unknown as Character

    const { result } = renderHook(() => useCharacterForm({ initialData, onSuccess }))

    await act(async () => {
      await result.current.handleSubmit(
        { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>,
      )
    })

    await waitFor(() => expect(mockUpdateCharacter).toHaveBeenCalled())
    expect(toastSuccess).toHaveBeenCalledWith('Character updated successfully')
    expect(onSuccess).toHaveBeenCalled()
  })

  it('shows an error toast when getUser fails', async () => {
    const { useCharacterForm } = await import('./useCharacterForm.ts')

    const onSuccess = vi.fn()

    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const { result } = renderHook(() => useCharacterForm({ onSuccess }))

    const input = document.createElement('input')
    input.type = 'text'
    input.name = 'name'
    input.value = 'Valid Name'

    await act(async () => {
      await result.current.handleInputChange(
        { target: input } as unknown as React.ChangeEvent<HTMLInputElement>,
      )
    })

    await act(async () => {
      await result.current.handleSubmit(
        { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>,
      )
    })

    await waitFor(() => expect(toastError).toHaveBeenCalledWith('No user authenticated'))
    expect(mockInsertCharacter).not.toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('shows an error toast when insertCharacter fails', async () => {
    const { useCharacterForm } = await import('./useCharacterForm.ts')

    const onSuccess = vi.fn()

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })

    mockInsertCharacter.mockResolvedValue({
      data: null,
      error: new Error('DB insert failed'),
    })

    const { result } = renderHook(() => useCharacterForm({ onSuccess }))

    const input = document.createElement('input')
    input.type = 'text'
    input.name = 'name'
    input.value = 'Valid Name'

    await act(async () => {
      await result.current.handleInputChange(
        { target: input } as unknown as React.ChangeEvent<HTMLInputElement>,
      )
    })

    await act(async () => {
      await result.current.handleSubmit(
        { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>,
      )
    })

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('DB insert failed')
    })
    expect(mockInsertCharacter).toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })
})

