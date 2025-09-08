export function calculateOdds(yesBets: number, noBets: number) {
  const total = yesBets + noBets
  if (total === 0) {
    return { yesMultiplier: 2, noMultiplier: 2, yesShare: 0.5 }
  }
  
  const yesShare = yesBets / total
  const noShare = noBets / total
  
  return {
    yesMultiplier: 2 - yesShare,
    noMultiplier: 2 - noShare,
    yesShare
  }
}

export const STAKE_AMOUNT = 100 // Fixed stake per swipe in $FLIQ
