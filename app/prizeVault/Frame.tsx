import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  NextServerPageProps
} from 'frames.js/next/server'
import { Address, createPublicClient, formatUnits, http, parseUnits } from 'viem'
import { erc20ABI, vaultABI } from '@generationsoftware/hyperstructure-client-js'
import { FrameData, FrameProps, VaultData, View } from './types'
import { baseClassName } from './constants'
import { getBalances, getFrameData } from './utils'
import { PTLogo, PrizeVaultFrameImageContent } from './FrameImage'

interface PrizeVaultFrameProps {
  vaultData: VaultData
  searchParams: NextServerPageProps['searchParams']
}

export const PrizeVaultFrame = async (props: PrizeVaultFrameProps) => {
  const { vaultData, searchParams } = props

  const frame = await getFrameData(vaultData, searchParams)

  const client = createPublicClient({ chain: vaultData.chain, transport: http() })

  const frameProps: FrameProps = { frameData: frame, vaultData, client }

  if (frame.state.v === View.welcome) {
    return <WelcomeFrame {...frameProps} />
  } else if (frame.state.v === View.account) {
    return <AccountFrame {...frameProps} />
  } else if (frame.state.v === View.depositParams) {
    return <DepositParamsFrame {...frameProps} />
  } else if (frame.state.v === View.approveTx || frame.state.v === View.depositTx) {
    return <DepositTxFrame {...frameProps} />
  } else if (frame.state.v === View.withdrawParams) {
    return <WithdrawParamsFrame {...frameProps} />
  } else if (frame.state.v === View.withdrawTx) {
    return <WithdrawTxFrame {...frameProps} />
  }

  return <></>
}

const WelcomeFrame = (props: FrameProps) => {
  const { frameData, vaultData } = props

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <div tw={baseClassName}>
          <span tw='mb-8'>Deposit {vaultData.token.symbol} for a chance to win daily!</span>
          <span tw='mb-8'>Withdraw anytime.</span>
          <PTLogo />
        </div>
      </FrameImage>
      <FrameButton>Deposit</FrameButton>
      <FrameButton>View Account</FrameButton>
      <FrameButton action='link' target='https://pooltogether.com/'>
        Learn More
      </FrameButton>
    </FrameContainer>
  )
}

const AddressFrame = (props: { frameData: FrameData }) => {
  const { frameData } = props

  const isInvalidWalletAddress =
    frameData.previousFrame.prevState?.v === frameData.state.v && !!frameData.message?.inputText

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <div tw={baseClassName}>
          <span tw='mb-8'>Enter your wallet address</span>
          {isInvalidWalletAddress && <span tw='mb-8 text-[#FFB6B6]'>Invalid wallet address</span>}
          <PTLogo />
        </div>
      </FrameImage>
      <FrameInput text='0x...' />
      <FrameButton>Submit</FrameButton>
    </FrameContainer>
  )
}

const AccountFrame = async (props: FrameProps) => {
  const { frameData, vaultData, client } = props

  // TODO: also check backend to see if we have the fid mapped to an address already (unless user clicked "switch account")
  const userAddress = frameData.state.a

  if (!userAddress) {
    return <AddressFrame frameData={frameData} />
  }

  const { shareBalance, tokenBalance } = await getBalances(vaultData, client, userAddress)

  frameData.state.sb = shareBalance
  frameData.state.tb = tokenBalance

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <PrizeVaultFrameImageContent
          vaultData={vaultData}
          userAddress={userAddress}
          shareBalance={shareBalance}
        >
          <span>Welcome to your account :)</span>
        </PrizeVaultFrameImageContent>
      </FrameImage>
      <FrameButton>Deposit</FrameButton>
      <FrameButton>Withdraw</FrameButton>
      <FrameButton>Switch Account</FrameButton>
    </FrameContainer>
  )
}

const DepositParamsFrame = async (props: FrameProps) => {
  const { frameData, vaultData, client } = props

  // TODO: also check backend to see if we have the fid mapped to an address already
  const userAddress = frameData.state.a

  if (!userAddress) {
    return <AddressFrame frameData={frameData} />
  }

  const { shareBalance, tokenBalance } = await getBalances(vaultData, client, userAddress)

  frameData.state.sb = shareBalance
  frameData.state.tb = tokenBalance

  const isInvalidAmount =
    frameData.previousFrame.prevState?.v === View.depositParams &&
    !!frameData.previousFrame.prevState.a

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <PrizeVaultFrameImageContent
          vaultData={vaultData}
          userAddress={frameData.state.a}
          shareBalance={frameData.state.sb}
          extraContent={{
            text: `Available to deposit`,
            amount: frameData.state.tb ?? 0,
            symbol: vaultData.token.symbol
          }}
        >
          <span>Choose an amount to deposit</span>
          {isInvalidAmount && <span tw='mt-8 text-[#FFB6B6]'>Invalid token amount</span>}
        </PrizeVaultFrameImageContent>
      </FrameImage>
      <FrameInput text={`Enter an amount of ${vaultData.token.symbol}...`} />
      <FrameButton>Back</FrameButton>
      <FrameButton>Deposit Amount</FrameButton>
    </FrameContainer>
  )
}

const DepositTxFrame = async (props: FrameProps) => {
  const { frameData, vaultData, client } = props

  const depositTokenAmount = frameData.state.da ?? 0

  const isJustDeposited =
    frameData.previousFrame.prevState?.v === View.depositTx && !!frameData.message?.transactionId

  if (isJustDeposited) {
    const _newShareBalance = await client.readContract({
      address: vaultData.address,
      abi: vaultABI,
      functionName: 'balanceOf',
      args: [frameData.state.a as Address]
    })

    const newShareBalance = parseFloat(formatUnits(_newShareBalance, vaultData.token.decimals))

    frameData.state.sb = newShareBalance

    return (
      <FrameContainer {...frameData}>
        <FrameImage aspectRatio='1:1'>
          <PrizeVaultFrameImageContent
            vaultData={vaultData}
            userAddress={frameData.state.a}
            shareBalance={newShareBalance}
          >
            <span>
              Deposited {depositTokenAmount.toLocaleString()} {vaultData.token.symbol}
            </span>
          </PrizeVaultFrameImageContent>
        </FrameImage>
        <FrameButton>Continue</FrameButton>
      </FrameContainer>
    )
  }

  const allowance = await client.readContract({
    address: vaultData.token.address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [frameData.state.a as Address, vaultData.address]
  })

  const parsedDepositTokenAmount = parseUnits(
    depositTokenAmount.toString(),
    vaultData.token.decimals
  )

  if (allowance >= parsedDepositTokenAmount) {
    const isJustApproved =
      frameData.previousFrame.prevState?.v === View.approveTx && !!frameData.message?.transactionId

    return (
      <FrameContainer {...frameData}>
        <FrameImage aspectRatio='1:1'>
          <PrizeVaultFrameImageContent
            vaultData={vaultData}
            userAddress={frameData.state.a}
            shareBalance={frameData.state.sb}
            extraContent={{
              text: `Depositing...`,
              amount: depositTokenAmount,
              symbol: vaultData.token.symbol
            }}
          >
            {isJustApproved && (
              <span tw='mb-8'>You've just approved some {vaultData.token.symbol}!</span>
            )}
            <span>Ready to deposit</span>
          </PrizeVaultFrameImageContent>
        </FrameImage>
        <FrameButton>Cancel</FrameButton>
        <FrameButton
          action='tx'
          target={`/prizeVault/${vaultData.id}/deposit?a=${frameData.state.a}&da=${depositTokenAmount}`}
        >
          Deposit
        </FrameButton>
      </FrameContainer>
    )
  }

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <PrizeVaultFrameImageContent
          vaultData={vaultData}
          userAddress={frameData.state.a}
          shareBalance={frameData.state.sb}
          extraContent={{
            text: `Approving...`,
            amount: depositTokenAmount,
            symbol: vaultData.token.symbol
          }}
        >
          <span>You need to approve these tokens to deposit</span>
        </PrizeVaultFrameImageContent>
      </FrameImage>
      <FrameButton>Cancel</FrameButton>
      <FrameButton
        action='tx'
        target={`/prizeVault/${vaultData.id}/approve?aa=${depositTokenAmount}`}
      >
        Approve
      </FrameButton>
    </FrameContainer>
  )
}

const WithdrawParamsFrame = (props: FrameProps) => {
  const { frameData, vaultData } = props

  const isInvalidAmount = frameData.previousFrame.prevState?.v === View.withdrawParams

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <PrizeVaultFrameImageContent
          vaultData={vaultData}
          userAddress={frameData.state.a}
          shareBalance={frameData.state.sb}
        >
          <span>Choose an amount to withdraw</span>
          {isInvalidAmount && <span tw='mt-8 text-[#FFB6B6]'>Invalid amount</span>}
        </PrizeVaultFrameImageContent>
      </FrameImage>
      <FrameInput text={`Enter an amount of ${vaultData.symbol}...`} />
      <FrameButton>Back</FrameButton>
      <FrameButton>Withdraw Amount</FrameButton>
    </FrameContainer>
  )
}

const WithdrawTxFrame = async (props: FrameProps) => {
  const { frameData, vaultData, client } = props

  const withdrawShareAmount = frameData.state.wa ?? 0

  const isJustWithdrew =
    frameData.previousFrame.prevState?.v === View.withdrawTx && !!frameData.message?.transactionId

  if (isJustWithdrew) {
    const _newShareBalance = await client.readContract({
      address: vaultData.address,
      abi: vaultABI,
      functionName: 'balanceOf',
      args: [frameData.state.a as Address]
    })

    const newShareBalance = parseFloat(formatUnits(_newShareBalance, vaultData.token.decimals))

    frameData.state.sb = newShareBalance

    return (
      <FrameContainer {...frameData}>
        <FrameImage aspectRatio='1:1'>
          <PrizeVaultFrameImageContent
            vaultData={vaultData}
            userAddress={frameData.state.a}
            shareBalance={newShareBalance}
          >
            <span>
              Withdrew {withdrawShareAmount.toLocaleString()} {vaultData.symbol}
            </span>
          </PrizeVaultFrameImageContent>
        </FrameImage>
        <FrameButton>Continue</FrameButton>
      </FrameContainer>
    )
  }

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <PrizeVaultFrameImageContent
          vaultData={vaultData}
          userAddress={frameData.state.a}
          shareBalance={frameData.state.sb}
          extraContent={{
            text: `Withdrawing...`,
            amount: withdrawShareAmount,
            symbol: vaultData.symbol
          }}
        >
          <span>Ready to withdraw</span>
        </PrizeVaultFrameImageContent>
      </FrameImage>
      <FrameButton>Cancel</FrameButton>
      <FrameButton
        action='tx'
        target={`/prizeVault/${vaultData.id}/withdraw?a=${frameData.state.a}&wa=${withdrawShareAmount}`}
      >
        Withdraw
      </FrameButton>
    </FrameContainer>
  )
}
