import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  NextServerPageProps
} from 'frames.js/next/server'
import { Address, createPublicClient, formatUnits, http } from 'viem'
import { FrameProps, VaultData, View } from './types'
import { baseClassName } from './constants'
import { getBalances, getFrameData } from './utils'
import { PTLogo, PrizeVaultFrameImageContent } from './FrameImage'
import { rpcUrls } from '../contants'
import { saveUserState } from './state'

interface PrizeVaultFrameProps {
  vaultData: VaultData
  searchParams: NextServerPageProps['searchParams']
}

export const PrizeVaultFrame = async (props: PrizeVaultFrameProps) => {
  const { vaultData, searchParams } = props

  const frameData = await getFrameData(vaultData, searchParams)

  const client = createPublicClient({
    chain: vaultData.chain,
    transport: http(rpcUrls[vaultData.chain.id])
  })

  const frameProps: FrameProps = { frameData, vaultData, client }
  const view = frameData.userState.view

  if (view === View.welcome) {
    return <WelcomeFrame {...frameProps} />
  } else if (view === View.address) {
    return <AddressFrame {...frameProps} />
  } else if (view === View.account) {
    return <AccountFrame {...frameProps} />
  } else if (view === View.depositParams) {
    return <DepositParamsFrame {...frameProps} />
  } else if (view === View.approveTx) {
    return <ApproveTxFrame {...frameProps} />
  } else if (view === View.depositTx) {
    return <DepositTxFrame {...frameProps} />
  } else if (view === View.depositTxSuccess) {
    return <DepositTxSuccessFrame {...frameProps} />
  } else if (view === View.redeemParams) {
    return <RedeemParamsFrame {...frameProps} />
  } else if (view === View.redeemTx) {
    return <RedeemTxFrame {...frameProps} />
  } else if (view === View.redeemTxSuccess) {
    return <RedeemTxSuccessFrame {...frameProps} />
  }

  return <></>
}

const WelcomeFrame = (props: FrameProps) => {
  const { frameData, vaultData } = props

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <div tw={baseClassName}>
          <span tw='mb-8'>Deposit {vaultData.asset.symbol} for a chance to win daily!</span>
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

const AddressFrame = (props: FrameProps) => {
  const { frameData } = props

  const isInvalidWalletAddress =
    frameData.prevUserState.view === frameData.userState.view && !!frameData.message?.inputText

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

  const { shares, assets, allowance } = await getBalances(
    vaultData,
    client,
    frameData.userState.userAddress as Address
  )

  frameData.userState.balance = { shares: shares.toString(), assets: assets.toString() }
  frameData.userState.allowance = allowance.toString()
  await saveUserState(frameData.state.fid as number, frameData.userState)

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <PrizeVaultFrameImageContent
          vaultData={vaultData}
          userAddress={frameData.userState.userAddress}
          shares={shares}
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

  const { shares, assets, allowance } = await getBalances(
    vaultData,
    client,
    frameData.userState.userAddress as Address
  )

  frameData.userState.balance = { shares: shares.toString(), assets: assets.toString() }
  frameData.userState.allowance = allowance.toString()
  await saveUserState(frameData.state.fid as number, frameData.userState)

  const isInvalidAmount =
    frameData.prevUserState.view === frameData.userState.view && !!frameData.message?.inputText

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <PrizeVaultFrameImageContent
          vaultData={vaultData}
          userAddress={frameData.userState.userAddress}
          shares={shares}
          extraContent={{
            text: `Available to deposit`,
            amount: parseFloat(formatUnits(assets, vaultData.asset.decimals)),
            symbol: vaultData.asset.symbol
          }}
        >
          <span>Choose an amount to deposit</span>
          {isInvalidAmount && <span tw='mt-8 text-[#FFB6B6]'>Invalid token amount</span>}
        </PrizeVaultFrameImageContent>
      </FrameImage>
      <FrameInput text={`Enter an amount of ${vaultData.asset.symbol}...`} />
      <FrameButton>Back</FrameButton>
      <FrameButton>Deposit Amount</FrameButton>
    </FrameContainer>
  )
}

const ApproveTxFrame = async (props: FrameProps) => {
  const { frameData, vaultData } = props

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <PrizeVaultFrameImageContent
          vaultData={vaultData}
          userAddress={frameData.userState.userAddress}
          shares={BigInt(frameData.userState.balance?.shares ?? '0')}
          extraContent={{
            text: `Approving...`,
            amount: parseFloat(
              formatUnits(
                BigInt(frameData.userState.depositAssetAmount ?? '0'),
                vaultData.asset.decimals
              )
            ),
            symbol: vaultData.asset.symbol
          }}
        >
          <span>You need to approve these tokens to deposit</span>
        </PrizeVaultFrameImageContent>
      </FrameImage>
      <FrameButton>Cancel</FrameButton>
      <FrameButton
        action='tx'
        target={`/prizeVault/${vaultData.id}/approve?aa=${frameData.userState.depositAssetAmount}`}
      >
        Approve
      </FrameButton>
    </FrameContainer>
  )
}

const DepositTxFrame = async (props: FrameProps) => {
  const { frameData, vaultData } = props

  const isJustApproved =
    frameData.prevUserState.view === frameData.userState.view && !!frameData.message?.transactionId

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <PrizeVaultFrameImageContent
          vaultData={vaultData}
          userAddress={frameData.userState.userAddress}
          shares={BigInt(frameData.userState.balance?.shares ?? '0')}
          extraContent={{
            text: `Depositing...`,
            amount: parseFloat(
              formatUnits(
                BigInt(frameData.userState.depositAssetAmount ?? '0'),
                vaultData.asset.decimals
              )
            ),
            symbol: vaultData.asset.symbol
          }}
        >
          {isJustApproved && (
            <span tw='mb-8'>You've just approved some {vaultData.asset.symbol}!</span>
          )}
          <span>Ready to deposit</span>
        </PrizeVaultFrameImageContent>
      </FrameImage>
      <FrameButton>Cancel</FrameButton>
      <FrameButton
        action='tx'
        target={`/prizeVault/${vaultData.id}/deposit?a=${frameData.userState.userAddress}&da=${frameData.userState.depositAssetAmount}`}
      >
        Deposit
      </FrameButton>
    </FrameContainer>
  )
}

const DepositTxSuccessFrame = async (props: FrameProps) => {
  const { frameData, vaultData, client } = props

  const { shares, assets } = await getBalances(
    vaultData,
    client,
    frameData.userState.userAddress as Address
  )

  frameData.userState.balance = { shares: shares.toString(), assets: assets.toString() }
  await saveUserState(frameData.state.fid as number, frameData.userState)

  const formattedDepositAssetAmount = parseFloat(
    formatUnits(BigInt(frameData.userState.depositAssetAmount ?? '0'), vaultData.asset.decimals)
  ).toLocaleString('en', { maximumFractionDigits: 4 })

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <PrizeVaultFrameImageContent
          vaultData={vaultData}
          userAddress={frameData.userState.userAddress}
          shares={shares}
        >
          <span>
            Deposited {formattedDepositAssetAmount} {vaultData.asset.symbol}
          </span>
        </PrizeVaultFrameImageContent>
      </FrameImage>
      <FrameButton>View Account</FrameButton>
    </FrameContainer>
  )
}

const RedeemParamsFrame = (props: FrameProps) => {
  const { frameData, vaultData } = props

  const isInvalidAmount =
    frameData.prevUserState.view === frameData.userState.view && !!frameData.message?.inputText

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <PrizeVaultFrameImageContent
          vaultData={vaultData}
          userAddress={frameData.userState.userAddress}
          shares={BigInt(frameData.userState.balance?.shares ?? '0')}
        >
          <span>Choose an amount to withdraw (or withdraw all)</span>
          {isInvalidAmount && <span tw='mt-8 text-[#FFB6B6]'>Invalid amount</span>}
        </PrizeVaultFrameImageContent>
      </FrameImage>
      <FrameInput text={`Enter an amount of ${vaultData.symbol}...`} />
      <FrameButton>Back</FrameButton>
      <FrameButton>Withdraw Amount</FrameButton>
      <FrameButton>Withdraw All</FrameButton>
    </FrameContainer>
  )
}

const RedeemTxFrame = async (props: FrameProps) => {
  const { frameData, vaultData } = props

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <PrizeVaultFrameImageContent
          vaultData={vaultData}
          userAddress={frameData.userState.userAddress}
          shares={BigInt(frameData.userState.balance?.shares ?? '0')}
          extraContent={{
            text: `Withdrawing...`,
            amount: parseFloat(
              formatUnits(
                BigInt(frameData.userState.redeemShareAmount ?? '0'),
                vaultData.asset.decimals
              )
            ),
            symbol: vaultData.symbol
          }}
        >
          <span>Ready to withdraw</span>
        </PrizeVaultFrameImageContent>
      </FrameImage>
      <FrameButton>Cancel</FrameButton>
      <FrameButton
        action='tx'
        target={`/prizeVault/${vaultData.id}/redeem?a=${frameData.userState.userAddress}&ra=${frameData.userState.redeemShareAmount}`}
      >
        Withdraw
      </FrameButton>
    </FrameContainer>
  )
}

const RedeemTxSuccessFrame = async (props: FrameProps) => {
  const { frameData, vaultData, client } = props

  const { shares, assets } = await getBalances(
    vaultData,
    client,
    frameData.userState.userAddress as Address
  )

  frameData.userState.balance = { shares: shares.toString(), assets: assets.toString() }
  await saveUserState(frameData.state.fid as number, frameData.userState)

  const formattedRedeemShareAmount = parseFloat(
    formatUnits(BigInt(frameData.userState.redeemShareAmount ?? '0'), vaultData.asset.decimals)
  ).toLocaleString('en', { maximumFractionDigits: 4 })

  return (
    <FrameContainer {...frameData}>
      <FrameImage aspectRatio='1:1'>
        <PrizeVaultFrameImageContent
          vaultData={vaultData}
          userAddress={frameData.userState.userAddress}
          shares={shares}
        >
          <span>
            Withdrew {formattedRedeemShareAmount} {vaultData.symbol}
          </span>
        </PrizeVaultFrameImageContent>
      </FrameImage>
      <FrameButton>View Account</FrameButton>
    </FrameContainer>
  )
}
