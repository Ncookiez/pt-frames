import { Address, formatUnits } from 'viem'
import { baseClassName } from './constants'
import { ReactNode } from 'react'
import { VaultData } from './types'
import { shorten } from '@generationsoftware/hyperstructure-client-js'

interface PrizeVaultFrameImageContentProps {
  vaultData: VaultData
  children: ReactNode
  userAddress?: Address
  shares?: bigint
  extraContent?: { text: string; amount: number; symbol: string }
}

export const PrizeVaultFrameImageContent = (props: PrizeVaultFrameImageContentProps) => {
  const { vaultData, children, userAddress, shares, extraContent } = props

  return (
    <div tw={baseClassName}>
      <Card tw='w-full grow text-center text-5xl'>{children}</Card>
      <Card tw='w-full flex-row items-start justify-start mt-8'>
        <div tw='flex flex-col grow items-center'>
          <span tw='font-semibold'>Balance</span>
          {shares !== undefined ? (
            <span tw='text-6xl'>
              {parseFloat(formatUnits(shares, vaultData.asset.decimals)).toLocaleString('en', {
                maximumFractionDigits: 4
              })}{' '}
              {vaultData.symbol}
            </span>
          ) : (
            <span>-</span>
          )}
        </div>
        {extraContent !== undefined && (
          <div tw='w-1/2 flex flex-col items-center border-l-2 border-[#f5f0ff]'>
            <span>{extraContent.text}</span>
            <span tw='mt-3'>
              {extraContent.amount.toLocaleString('en', {
                maximumFractionDigits: 4
              })}{' '}
              {extraContent.symbol}
            </span>
          </div>
        )}
      </Card>
      <div tw='w-full flex mt-8'>
        <div tw='flex p-8'>
          <PTLogo />
        </div>
        <Card tw='grow ml-8 bg-[#36147D]'>
          <span>Connected Account:</span>
          {!!userAddress ? <span>{shorten(userAddress)}</span> : <span>-</span>}
        </Card>
      </div>
    </div>
  )
}

interface CardProps {
  children: ReactNode
  tw?: string
}

const Card = (props: CardProps) => {
  const { children, tw } = props

  return (
    <div tw={'flex flex-col items-center justify-center p-8 bg-[#4C249F] rounded-xl ' + tw}>
      {children}
    </div>
  )
}

export const PTLogo = (props: { width?: number; height?: number }) => (
  <svg
    width={props.height ? props.height * (716 / 284) : props.width ?? 358}
    height={props.width ? props.width * (284 / 716) : props.height ?? 142}
    viewBox='0 0 716 284'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M30.3339 62.4837C29.8869 58.3689 32.0591 57.9172 33.2011 58.2056C33.2011 58.2056 52.0917 66.23 89.8159 66.8885C127.54 67.5469 148.301 58.4869 148.301 58.4869C149.444 58.204 151.614 58.6664 151.147 62.7789C150.68 66.8915 149.965 78.7739 149.666 84.201L171.377 84.254C174.044 84.1653 178.973 85.7009 177.356 92.5532C177.027 93.9471 176.545 96.3319 175.925 99.3935C172.738 115.144 165.925 148.809 157.771 157.639C152.041 164.481 144.32 167.891 138.317 169.304C133.317 170.791 128.102 170.53 126.299 170.439L126.299 170.439C126.04 170.426 125.852 170.417 125.745 170.416C121.731 176.406 111.472 189.35 102.549 193.214C99.6405 194.263 99.6637 195.32 99.682 196.151C99.6835 196.219 99.685 196.285 99.6848 196.349C100.142 204.063 102.081 221.323 106.176 228.646C106.72 229.739 106.872 230.571 106.977 231.141C107.092 231.765 107.149 232.077 107.596 232.078L113.024 232.091C113.596 232.092 114.967 232.096 115.878 233.241C116.365 233.853 117.22 233.839 118.149 233.824C119.393 233.803 120.773 233.781 121.587 235.254C122.458 236.832 122.277 238.517 122.184 239.385C122.163 239.574 122.147 239.724 122.147 239.827L130.717 239.848C131.765 239.85 133.858 240.369 133.853 242.426L133.811 259.567C133.811 259.879 133.788 260.134 133.77 260.343C133.688 261.28 133.688 261.28 136.093 261.286L143.52 261.304C143.997 261.306 144.948 261.365 144.942 263.879L144.923 271.592C144.922 272.164 144.919 273.306 142.348 273.3L38.104 273.045C35.5329 273.039 35.5357 271.896 35.5371 271.325L35.556 263.612C35.5621 261.098 36.5138 261.043 36.9906 261.044L44.4181 261.062C46.8229 261.068 46.8229 261.068 46.7453 260.13L46.7453 260.13L46.7453 260.13C46.728 259.921 46.7069 259.666 46.7077 259.354L46.7496 242.213C46.7546 240.157 48.8508 239.648 49.8983 239.65L58.4685 239.671C58.4687 239.569 58.4533 239.419 58.4339 239.229C58.3448 238.361 58.1718 236.675 59.051 235.102C59.8722 233.632 61.2513 233.661 62.4955 233.688C63.425 233.707 64.2792 233.725 64.7693 233.116C65.6863 231.975 67.0575 231.979 67.6289 231.98L73.0567 231.993C73.5042 231.995 73.563 231.683 73.6805 231.06C73.7881 230.49 73.9448 229.659 74.4934 228.569C78.6249 221.266 80.6478 204.016 81.1427 196.304C81.1429 196.24 81.1447 196.174 81.1465 196.107L81.1465 196.106C81.1688 195.275 81.1973 194.218 78.2937 193.154C69.3902 189.247 59.1948 176.253 55.21 170.244C55.1031 170.244 54.9161 170.252 54.6595 170.264L54.6581 170.264L54.6554 170.264L54.6552 170.264C52.8517 170.346 47.6361 170.582 42.6432 169.071C36.6475 167.628 28.9427 164.181 23.246 157.311C15.1355 148.441 8.48736 114.743 5.37695 98.9767C4.77236 95.9121 4.30143 93.5251 3.9794 92.1295C2.39638 85.2695 7.33272 83.7579 9.99878 83.8597L31.7099 83.9127C31.4375 78.4842 30.7809 66.5986 30.3339 62.4837ZM15.8476 93.4105C12.5076 93.3522 13.3007 97.257 13.9042 100.228C13.9825 100.614 14.0576 100.983 14.1201 101.327C14.6639 104.316 17.1903 116.638 23.8372 136.461C30.484 156.285 43.3322 157.727 48.9255 155.971C45.0967 147.693 37.0168 121.196 35.3888 112.029C33.7607 102.862 31.7356 93.6877 29.3524 93.6462L15.8476 93.4105ZM167.242 101.408C167.897 98.4475 168.758 94.5571 165.418 94.5571L151.911 94.5571C149.528 94.5571 147.343 103.694 145.555 112.831C143.767 121.968 135.226 148.32 131.253 156.531C136.815 158.384 149.686 157.166 156.678 137.462C163.67 117.757 166.411 105.482 167.007 102.502C167.076 102.16 167.157 101.792 167.242 101.408L167.242 101.408ZM109.937 132.129L90.4634 144.384L71.0746 131.994L90.4062 160.182L90.4062 160.19L90.4089 160.186L90.4117 160.19L90.4117 160.182L109.937 132.129ZM90.6544 90.6369L90.6544 90.6188L90.6491 90.6278L90.644 90.6189L90.6439 90.6367L70.9767 124.244L90.4858 136.479L90.4857 136.485L90.4911 136.482L90.4962 136.485L90.4962 136.479L110.089 124.38L90.6544 90.6369Z'
      fill='#FFB636'
    />
    <path
      d='M150.342 59.0848C150.294 64.5697 123.755 68.7848 91.0653 68.4995C58.3754 68.2142 31.1194 63.5227 31.1673 58.0378C31.2152 52.553 58.5488 48.3517 91.2387 48.637C123.929 48.9223 150.39 53.5999 150.342 59.0848Z'
      fill='#FFD469'
    />
    <path
      d='M133.184 78.6368C136.105 78.6368 136.626 78.6368 141.923 76.7831C141.266 80.3072 137.812 107.016 136.626 111.208C133.458 122.409 129.879 139.718 125.24 143.064C124.358 143.699 120.473 143.064 119.027 142.132C117.581 141.2 122.592 131.598 128.682 111.208C132.125 89.229 131.066 79.696 133.184 78.6368Z'
      fill='#FFCC4E'
    />
    <path
      d='M291.226 50.5033C327.31 50.5033 356.562 80.2436 356.562 116.93V155.126C356.562 191.812 327.31 221.552 291.226 221.552C285.558 221.552 280.059 220.819 274.815 219.439L274.815 223.948C274.815 250.786 253.313 272.593 226.624 273.027L225.813 273.033V126.894L225.888 126.892L225.89 116.93C225.89 80.2436 255.142 50.5033 291.226 50.5033ZM583.816 50.5033C619.921 50.5033 649.19 80.4136 649.19 117.31V155.724C649.19 192.62 619.921 222.53 583.816 222.53C547.711 222.53 518.442 192.62 518.442 155.724V117.31C518.442 80.4136 547.711 50.5033 583.816 50.5033ZM437.502 47.3468C473.607 47.3468 502.876 77.2571 502.876 114.153V152.567C502.876 189.463 473.607 219.374 437.502 219.374C401.397 219.374 372.128 189.463 372.128 152.567V114.153C372.128 77.2571 401.397 47.3468 437.502 47.3468ZM714.565 0V169.48C714.565 196.76 692.708 218.926 665.579 219.367L664.756 219.374V49.8933C664.756 22.338 687.056 0 714.565 0ZM583.816 100.608C574.79 100.608 567.472 108.086 567.472 117.31V155.724C567.472 164.948 574.79 172.425 583.816 172.425C592.842 172.425 600.16 164.948 600.16 155.724V117.31C600.16 108.086 592.842 100.608 583.816 100.608ZM291.226 100.323C282.205 100.323 274.892 107.758 274.892 116.93V155.126C274.892 164.297 282.205 171.732 291.226 171.732C300.247 171.732 307.56 164.297 307.56 155.126V116.93C307.56 107.758 300.247 100.323 291.226 100.323ZM437.502 97.4517C428.476 97.4517 421.158 104.929 421.158 114.153V152.567C421.158 161.791 428.476 169.269 437.502 169.269C446.528 169.269 453.845 161.791 453.845 152.567V114.153C453.845 104.929 446.528 97.4517 437.502 97.4517Z'
      fill='white'
    />
    <path
      d='M531.611 265.029H530.252C528.901 265.029 527.714 263.764 527.714 261.794V252.487H530.612C531.961 252.487 532.99 251.594 532.99 250.324C532.99 249.682 532.751 249.111 532.313 248.702C531.878 248.296 531.279 248.081 530.612 248.081H527.714V242.862C527.714 241.437 526.651 240.381 525.216 240.381C523.781 240.381 522.717 241.437 522.717 242.862V248.081H521.378C520.711 248.081 520.113 248.296 519.677 248.702C519.239 249.111 519 249.682 519 250.324C519 251.594 520.029 252.487 521.378 252.487H522.717V261.794C522.717 266.429 525.936 269.99 530.252 269.99H530.972C532.525 269.99 533.83 269.01 533.83 267.51C533.83 266.15 532.908 265.029 531.611 265.029Z'
      fill='white'
    />
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M561.745 258.659L561.745 258.656C561.704 251.921 556.931 247.129 550.253 247.129C546.894 247.129 544.004 248.315 541.954 250.366C539.904 252.417 538.721 255.306 538.721 258.659C538.721 261.993 539.905 264.871 541.954 266.917C544.005 268.963 546.894 270.149 550.253 270.149C553.593 270.149 556.473 268.962 558.517 266.917C560.562 264.871 561.745 261.993 561.745 258.659ZM550.253 251.693C552.201 251.693 553.836 252.416 554.986 253.63C556.137 254.847 556.829 256.587 556.829 258.659C556.829 260.731 556.138 262.459 554.987 263.666C553.838 264.871 552.203 265.585 550.253 265.585C548.303 265.585 546.657 264.87 545.498 263.664C544.337 262.457 543.638 260.729 543.638 258.659C543.638 254.541 546.397 251.693 550.253 251.693Z'
      fill='white'
    />
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M579.146 279C575.213 279 571.626 277.436 569.243 274.449C568.8 273.91 568.633 273.281 568.74 272.678C568.846 272.079 569.213 271.552 569.75 271.188L569.755 271.185C570.952 270.393 572.4 270.75 573.185 271.771C574.517 273.459 576.561 274.436 579.225 274.436C581.018 274.436 582.652 273.779 583.84 272.536C585.026 271.294 585.801 269.429 585.801 266.954V266.639C584.034 268.85 581.465 270.149 578.426 270.149C575.294 270.149 572.601 268.954 570.694 266.904C568.79 264.856 567.693 261.982 567.693 258.659C567.693 255.306 568.876 252.417 570.926 250.366C572.977 248.315 575.866 247.129 579.225 247.129C585.903 247.129 590.676 251.921 590.718 258.656L590.718 258.659L590.718 267.232C590.718 273.753 586 279 579.146 279ZM579.225 265.585C577.275 265.585 575.63 264.87 574.47 263.664C573.31 262.457 572.61 260.729 572.61 258.659C572.61 254.541 575.369 251.693 579.225 251.693C581.173 251.693 582.808 252.416 583.958 253.63C585.11 254.847 585.801 256.587 585.801 258.659C585.801 260.731 585.11 262.459 583.959 263.666C582.81 264.871 581.175 265.585 579.225 265.585Z'
      fill='white'
    />
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M616.03 264.309C615.151 263.59 613.856 263.619 612.895 264.334C611.896 265.068 610.081 265.743 608.557 265.743C604.933 265.743 602.257 263.632 601.494 260.544H616.072C616.724 260.544 617.313 260.327 617.741 259.921C618.172 259.513 618.411 258.943 618.411 258.302C618.411 255.071 617.452 252.275 615.644 250.28C613.83 248.279 611.201 247.129 607.958 247.129C604.675 247.129 601.844 248.317 599.835 250.37C597.827 252.421 596.666 255.308 596.666 258.659C596.666 261.998 597.893 264.878 600.01 266.923C602.126 268.966 605.103 270.149 608.557 270.149C611.098 270.149 614.207 269.125 616.102 267.622C616.649 267.2 616.947 266.619 616.926 265.99C616.906 265.37 616.579 264.782 616.041 264.317L616.03 264.309ZM607.958 251.534C609.636 251.534 610.956 252.096 611.915 253.03C612.765 253.858 613.357 255.005 613.641 256.377H601.537C601.879 255.004 602.552 253.862 603.509 253.035C604.596 252.096 606.084 251.534 607.958 251.534Z'
      fill='white'
    />
    <path
      d='M634.423 265.029H633.064C631.713 265.029 630.526 263.764 630.526 261.794V252.487H633.424C634.773 252.487 635.802 251.594 635.802 250.324C635.802 249.682 635.563 249.111 635.125 248.702C634.69 248.296 634.091 248.081 633.424 248.081H630.526V242.862C630.526 241.437 629.463 240.381 628.028 240.381C626.593 240.381 625.53 241.437 625.53 242.862V248.081H624.19C623.523 248.081 622.925 248.296 622.489 248.702C622.051 249.111 621.812 249.682 621.812 250.324C621.812 251.594 622.841 252.487 624.19 252.487H625.53V261.794C625.53 266.429 628.748 269.99 633.064 269.99H633.784C635.337 269.99 636.642 269.01 636.642 267.51C636.642 266.15 635.72 265.029 634.423 265.029Z'
      fill='white'
    />
    <path
      d='M654.025 247.089C651.611 247.089 649.423 247.838 647.729 249.146V240.52C647.729 239.806 647.475 239.17 647.013 238.711C646.551 238.252 645.91 238 645.191 238C644.471 238 643.831 238.252 643.368 238.711C642.906 239.17 642.652 239.806 642.652 240.52V267.51C642.652 268.224 642.906 268.86 643.368 269.319C643.831 269.778 644.471 270.03 645.191 270.03C645.91 270.03 646.551 269.778 647.013 269.319C647.475 268.86 647.729 268.224 647.729 267.51V256.317C647.729 253.766 650.025 251.733 653.225 251.733C654.954 251.733 656.406 252.213 657.423 253.17C658.435 254.121 659.081 255.605 659.081 257.746V267.51C659.081 268.935 660.184 270.03 661.619 270.03C663.055 270.03 664.158 268.935 664.158 267.51V257.746C664.158 254.346 663.082 251.671 661.249 249.845C659.416 248.02 656.873 247.089 654.025 247.089Z'
      fill='white'
    />
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M690.224 260.544H675.646C676.409 263.632 679.085 265.743 682.71 265.743C684.234 265.743 686.049 265.068 687.048 264.333C688.008 263.619 689.304 263.59 690.182 264.309L690.192 264.317C690.731 264.782 691.058 265.37 691.079 265.99C691.099 266.619 690.802 267.2 690.254 267.622C688.359 269.125 685.25 270.149 682.71 270.149C679.255 270.149 676.278 268.966 674.162 266.923C672.045 264.878 670.818 261.998 670.818 258.659C670.818 255.308 671.979 252.421 673.987 250.37C675.996 248.317 678.827 247.129 682.11 247.129C685.354 247.129 687.983 248.279 689.796 250.28C691.605 252.275 692.563 255.071 692.563 258.302C692.563 258.943 692.324 259.513 691.893 259.921C691.465 260.327 690.876 260.544 690.224 260.544ZM682.11 251.534C683.788 251.534 685.108 252.096 686.067 253.03C686.918 253.858 687.509 255.005 687.793 256.377H675.689C676.031 255.004 676.704 253.862 677.661 253.035C678.748 252.096 680.236 251.534 682.11 251.534Z'
      fill='white'
    />
    <path
      d='M709.975 247.049C707.592 247.049 705.385 247.913 703.736 249.347C703.673 248.788 703.477 248.301 703.108 247.934C702.648 247.478 702.001 247.288 701.261 247.288C700.529 247.288 699.887 247.493 699.428 247.949C698.97 248.404 698.762 249.042 698.762 249.768V267.51C698.762 268.252 698.968 268.893 699.431 269.347C699.893 269.798 700.536 269.99 701.261 269.99C702.008 269.99 702.654 269.786 703.11 269.326C703.566 268.868 703.759 268.229 703.759 267.51V255.92C703.759 254.301 704.604 253.073 706.063 252.339C707.543 251.595 709.668 251.361 712.149 251.841C712.736 251.974 713.339 251.966 713.858 251.711C714.396 251.448 714.767 250.957 714.936 250.285C715.053 249.82 715.009 249.358 714.803 248.936C714.6 248.521 714.254 248.174 713.813 247.899C712.938 247.354 711.623 247.049 709.975 247.049Z'
      fill='white'
    />
  </svg>
)
