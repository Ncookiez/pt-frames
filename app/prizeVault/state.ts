import fs from 'fs/promises'
import { View } from './types'
import { Address } from 'viem'
import { FrameReducer, PreviousFrame } from 'frames.js/next/types'

export type FrameState = {
  fid: number // farcaster ID
  t: number // timestamp
}

export type UserState = {
  view: View
  address?: Address
  balance?: {
    shares: string
    assets: string
  }
  depositAssetAmount?: string
  redeemShareAmount?: string
}

export const useAsyncFrameReducer = async (
  reducer: FrameReducer<UserState>,
  initialState: UserState,
  prevFrame: PreviousFrame<FrameState>
): Promise<{ frameState: FrameState | {}; userState: UserState }> => {
  if (prevFrame.prevState === null || prevFrame.postBody === null) {
    return { frameState: {}, userState: initialState }
  } else {
    const fid = prevFrame.postBody.untrustedData.fid
    const userState = reducer((await loadUserState(fid)) ?? initialState, prevFrame)
    await saveUserState(fid, userState)
    return {
      frameState: {
        fid,
        t: Math.floor(Date.now() / 1000)
      },
      userState
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

  if (!(await fs.stat(statePath)).isFile()) {
    return undefined
  } else {
    return JSON.parse(await fs.readFile(statePath, 'utf-8')) as UserState
  }
}

const saveUserState = async (fid: number, state: UserState) => {
  validateFid(fid)
  await tryMakeDataDir()

  await fs.writeFile(stateFilePath(fid), JSON.stringify(state))
}
