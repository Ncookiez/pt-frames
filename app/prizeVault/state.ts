import fs from 'fs/promises'
import { FrameState, UserState, VaultData } from './types'
import { PreviousFrame } from 'frames.js/next/types'
import { reducer as ReducerFn } from './utils'
import { isAddress } from 'viem'

export const useAsyncFramesReducer = async (
  reducer: typeof ReducerFn,
  initialState: UserState,
  prevFrame: PreviousFrame<FrameState>,
  vaultData: VaultData
): Promise<{ frameState: FrameState; userState: UserState; prevUserState: UserState }> => {
  if (prevFrame.prevState === null || prevFrame.postBody === null) {
    return { frameState: {}, userState: initialState, prevUserState: initialState }
  } else {
    const fid = prevFrame.postBody.untrustedData.fid
    let prevUserState = (await loadUserState(fid)) ?? initialState

    // initial state and wallet settings (first button click)
    if (!prevFrame.prevState.fid) {
      prevUserState = { ...prevUserState, ...initialState }

      // checking connected wallet
      if (
        !prevUserState.userAddress &&
        !!prevFrame.postBody.untrustedData.address &&
        isAddress(prevFrame.postBody.untrustedData.address)
      ) {
        prevUserState.userAddress = prevFrame.postBody.untrustedData.address
      }
    }

    const userState = reducer(JSON.parse(JSON.stringify(prevUserState)), prevFrame, vaultData)

    await saveUserState(fid, userState)

    return {
      frameState: {
        fid,
        t: Math.floor(Date.now() / 1000)
      },
      userState,
      prevUserState
    }
  }
}

const validateFid = (fid: any) => {
  if (typeof fid !== 'number') {
    throw new Error(`expected fid to be a number, got ${typeof fid}`)
  }
}

const tryMakeDataDir = async () => {
  try {
    await fs.mkdir('data')
  } catch {}
}

const stateFilePath = (fid: number) => {
  return `data/${fid}.json`
}

const loadUserState = async (fid: number): Promise<UserState | undefined> => {
  validateFid(fid)
  await tryMakeDataDir()

  const statePath = stateFilePath(fid)

  try {
    return JSON.parse(await fs.readFile(statePath, 'utf-8')) as UserState
  } catch {
    return undefined
  }
}

export const saveUserState = async (fid: number, state: UserState) => {
  validateFid(fid)
  await tryMakeDataDir()

  await fs.writeFile(stateFilePath(fid), JSON.stringify(state))
}
