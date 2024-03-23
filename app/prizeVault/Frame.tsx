import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  NextServerPageProps
} from 'frames.js/next/server'
import { Address, createPublicClient, formatUnits, http, parseUnits } from 'viem'
import { erc20ABI, vaultABI } from '@generationsoftware/hyperstructure-client-js'
import { FrameProps, VaultData, View } from './types'
import { baseClassName } from './constants'
import { getFrameData } from './utils'

interface PrizeVaultFrameProps {
  vaultData: VaultData
  searchParams: NextServerPageProps['searchParams']
}

export const PrizeVaultFrame = async (props: PrizeVaultFrameProps) => {
  const { vaultData, searchParams } = props

  const frame = await getFrameData(vaultData, searchParams)

  const client = createPublicClient({ chain: vaultData.chain, transport: http() })

  if (frame.state.v === View.welcome) {
    return <WelcomeFrame frameData={frame} vaultData={vaultData} client={client} />
  } else if (frame.state.v === View.account) {
    return <AccountFrame frameData={frame} vaultData={vaultData} client={client} />
  } else if (frame.state.v === View.deposit) {
    return <DepositFrame frameData={frame} vaultData={vaultData} client={client} />
  } else if (frame.state.v === View.withdraw) {
    return <WithdrawFrame frameData={frame} vaultData={vaultData} client={client} />
  }

  return <></>
}

const WelcomeFrame = (props: FrameProps) => {
  const { frameData, vaultData } = props

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
  const { frameData, vaultData, client } = props

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
  const { frameData, vaultData, client } = props

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
          {allowance < parsedDepositTokenAmount ? (
            <span>
              In order to deposit {frameData.state.da} {vaultData.token.symbol} you need to approve
              these tokens.
            </span>
          ) : (
            <span>
              Ready to deposit {frameData.state.da} {vaultData.token.symbol}!
            </span>
          )}
        </div>
      </FrameImage>
      <FrameButton>Back</FrameButton>
      {allowance >= parsedDepositTokenAmount ? (
        <FrameButton
          action='tx'
          target={`/prizeVault/${vaultData.id}/deposit?a=${frameData.state.a}&da=${frameData.state.da}`}
        >
          Deposit
        </FrameButton>
      ) : (
        <FrameButton
          action='tx'
          target={`/prizeVault/${vaultData.id}/approve?aa=${frameData.state.da}`}
        >
          Approve
        </FrameButton>
      )}
    </FrameContainer>
  )
}

const WithdrawFrame = (props: FrameProps) => {
  const { frameData, vaultData } = props

  // TODO: show tx hash if successful (and hide withdraw button)

  // TODO: show error if tx failed?

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <div tw={baseClassName}>
          <span>WITHDRAW</span>
          <span>
            Ready to withdraw {frameData.state.wa} {vaultData.symbol}!
          </span>
        </div>
      </FrameImage>
      <FrameButton>Back</FrameButton>
      <FrameButton
        action='tx'
        target={`/prizeVault/${vaultData.id}/withdraw?a=${frameData.state.a}&wa=${frameData.state.wa}`}
      >
        Withdraw
      </FrameButton>
    </FrameContainer>
  )
}
