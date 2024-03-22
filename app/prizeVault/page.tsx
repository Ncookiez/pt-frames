import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  NextServerPageProps,
  getFrameMessage,
  getPreviousFrame,
  useFramesReducer
} from 'frames.js/next/server'
import { Address, createPublicClient, formatUnits, http, parseUnits } from 'viem'
import { erc20ABI, vaultABI } from '@generationsoftware/hyperstructure-client-js'
import { FrameData, FrameProps, State, View } from './types'
import { baseClassName, initialState, vaultData } from './constants'
import { reducer } from './utils'

// This is a react server component only
export default async function Home({ searchParams }: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(searchParams)
  const [state] = useFramesReducer<State>(reducer, initialState, previousFrame)
  const frameMessage = await getFrameMessage(previousFrame.postBody)

  const frame: FrameData = {
    pathname: '/examples/transaction',
    postUrl: '/examples/transaction/frames',
    state,
    previousFrame,
    message: frameMessage
  }

  const client = createPublicClient({ chain: vaultData.chain, transport: http() })

  if (frame.state.v === View.welcome) {
    return <WelcomeFrame frameData={frame} client={client} />
  } else if (frame.state.v === View.account) {
    return <AccountFrame frameData={frame} client={client} />
  } else if (frame.state.v === View.deposit) {
    return <DepositFrame frameData={frame} client={client} />
  } else if (frame.state.v === View.withdraw) {
    return <WithdrawFrame frameData={frame} client={client} />
  }

  return <></>
}

const WelcomeFrame = (props: FrameProps) => {
  const { frameData } = props

  const isInvalidWalletAddress =
    !!frameData.previousFrame.prevState && frameData.previousFrame.prevState.v === View.welcome

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <div tw={baseClassName}>
          <span>WELCOME</span>
          <span>{vaultData.symbol} VAULT</span>
          {isInvalidWalletAddress && (
            <span>You sure that's a valid wallet address? Try again anon</span>
          )}
        </div>
      </FrameImage>
      <FrameInput text='Enter a wallet address here...' />
      <FrameButton>Get Started</FrameButton>
    </FrameContainer>
  )
}

const AccountFrame = async (props: FrameProps) => {
  const { frameData, client } = props

  const balances = await client.multicall({
    contracts: [
      {
        address: vaultData.address,
        abi: vaultABI,
        functionName: 'balanceOf',
        args: [frameData.state.a as Address]
      },
      {
        address: vaultData.token.address,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [frameData.state.a as Address]
      }
    ]
  })

  frameData.state.sb = parseFloat(
    formatUnits(balances[0].result as bigint, vaultData.token.decimals)
  )
  frameData.state.tb = parseFloat(
    formatUnits(balances[1].result as bigint, vaultData.token.decimals)
  )

  const isInvalidAmount =
    !!frameData.previousFrame.prevState && frameData.previousFrame.prevState.v === View.account

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <div tw={baseClassName}>
          <span>ACCOUNT</span>
          <span>
            Vault: {frameData.state.sb.toLocaleString()} {vaultData.symbol}
          </span>
          <span>
            Wallet: {frameData.state.tb.toLocaleString()} {vaultData.token.symbol}
          </span>
          {isInvalidAmount && (
            <span>
              You sure that's a valid amount? You can't deposit more {vaultData.token.symbol} than
              you have in your wallet, or withdraw more {vaultData.symbol} than you have in the
              prize vault
            </span>
          )}
        </div>
      </FrameImage>
      <FrameInput text='Amount to deposit or withdraw...' />
      <FrameButton>Back</FrameButton>
      <FrameButton>Deposit</FrameButton>
      <FrameButton>Withdraw</FrameButton>
    </FrameContainer>
  )
}

const DepositFrame = async (props: FrameProps) => {
  const { frameData, client } = props

  const allowance = await client.readContract({
    address: vaultData.token.address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [frameData.state.a as Address, vaultData.address]
  })

  // TODO: show tx hash if successful (and hide deposit button)
  // return (
  //   <FrameButton
  //     action="link"
  //     target={`https://optimistic.etherscan.io/tx/${frameMessage.transactionId}`}
  //   >
  //     View on block explorer
  //   </FrameButton>
  // )

  // TODO: show error if tx failed?

  const parsedDepositTokenAmount = parseUnits(
    frameData.state.da?.toString() ?? '0',
    vaultData.token.decimals
  )

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <div tw={baseClassName}>
          <span>DEPOSIT</span>
          <span>
            Depositing {frameData.state.da} {vaultData.token.symbol}
          </span>
          {allowance < parsedDepositTokenAmount && <span>(you need to approve these tokens)</span>}
        </div>
      </FrameImage>
      <FrameButton>Back</FrameButton>
      {allowance >= parsedDepositTokenAmount ? (
        <FrameButton
          action='tx'
          target={`/examples/transaction/deposit?a=${frameData.state.a}&da=${frameData.state.da}`}
        >
          Deposit
        </FrameButton>
      ) : (
        <FrameButton action='tx' target={`/examples/transaction/approve?aa=${frameData.state.da}`}>
          Approve
        </FrameButton>
      )}
    </FrameContainer>
  )
}

const WithdrawFrame = (props: FrameProps) => {
  const { frameData } = props

  // TODO: show tx hash if successful (and hide withdraw button)

  // TODO: show error if tx failed?

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <div tw={baseClassName}>
          <span>WITHDRAW</span>
          <span>
            Withdrawing {frameData.state.wa} {vaultData.symbol}
          </span>
        </div>
      </FrameImage>
      <FrameButton>Back</FrameButton>
      <FrameButton
        action='tx'
        target={`/examples/transaction/withdraw?a=${frameData.state.a}&wa=${frameData.state.wa}`}
      >
        Withdraw
      </FrameButton>
    </FrameContainer>
  )
}
