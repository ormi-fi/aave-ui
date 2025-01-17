import {
  setAmount,
  doConfirm,
  doSwapForRepay,
  getDashBoardBorrowRow,
  getDashBoardDepositRow,
} from './actions.steps';
import constants from '../../fixtures/constans.json';

type SkipType = {
  set: (val: boolean) => void;
  get: () => boolean;
};

const skipSetup = ({ skip, updateSkipStatus }: { skip: SkipType; updateSkipStatus: boolean }) => {
  before(function () {
    if (skip.get()) {
      this.skip();
    }
  });

  afterEach(function onAfterEach() {
    if ((this.currentTest as Mocha.Test).state === 'failed' && updateSkipStatus) {
      skip.set(true);
    }
  });
};

export const deposit = (
  {
    asset,
    amount,
    hasApproval = true,
  }: { asset: { shortName: string; fullName: string }; amount: number; hasApproval: boolean },
  skip: SkipType,
  updateSkipStatus = false
) => {
  let _shortName = asset.shortName;
  let _fullName = asset.fullName;

  return describe(`Deposit process for ${_shortName}`, () => {
    skipSetup({ skip, updateSkipStatus });
    it(`Open ${_shortName} borrow view`, () => {
      cy.get('.Menu strong').contains('Deposit').click();
      cy.get('.TokenIcon__name').contains(_fullName).click();
    });
    it(`Set ${amount} deposit amount for ${_shortName}`, () => {
      setAmount({ amount });
    });
    it(`Make approve for ${_shortName}, on confirmation page`, () => {
      doConfirm({ hasApproval, actionName: 'Deposit' });
    });
  });
};

export const borrow = (
  {
    asset,
    amount,
    apyType,
    hasApproval = true,
  }: {
    asset: { shortName: string; fullName: string };
    amount: number;
    apyType: string;
    hasApproval: boolean;
  },
  skip: SkipType,
  updateSkipStatus = false
) => {
  let _shortName = asset.shortName;
  let _fullName = asset.fullName;

  return describe(`Borrow process for ${_shortName}`, () => {
    skipSetup({ skip, updateSkipStatus });
    it(`Open ${_shortName} borrow view`, () => {
      cy.get('.Menu strong').contains('Borrow').click();
      cy.get('.TokenIcon__name').contains(_fullName).click();
    });
    it(`Set ${amount} borrow amount for ${_shortName}`, () => {
      setAmount({ amount });
    });
    it(`Choose ${
      apyType === constants.borrowAPYType.variable ? 'Variable' : 'Stable'
    } APY type`, () => {
      switch (apyType) {
        case constants.borrowAPYType.variable:
          cy.get('.InterestRateButton__inner p').contains('Variable APY').click();
          break;
        case constants.borrowAPYType.stable:
          cy.get('.InterestRateButton__inner p').contains('Stable APY').click();
          break;
        default:
          cy.get('.InterestRateButton__inner p').contains('Variable APY').click();
          break;
      }
      cy.get('.Button').contains('Continue').click();
    });
    it(`Make approve for ${_shortName}, on confirmation page`, () => {
      doConfirm({ hasApproval, actionName: 'Borrow' });
    });
  });
};

export const repay = (
  {
    asset,
    amount,
    repayOption,
    assetForRepay,
    hasApproval = false,
  }: {
    asset: { shortName: string; fullName: string };
    amount: number;
    repayOption: string;
    assetForRepay?: { shortName: string; fullName: string };
    hasApproval: boolean;
  },
  skip: SkipType,
  updateSkipStatus = false
) => {
  let _shortName = asset.shortName;
  let _shortNameAssetForRepay = assetForRepay ? assetForRepay.shortName : undefined;

  return describe(`Repay by ${repayOption} process for ${_shortName}`, () => {
    skipSetup({ skip, updateSkipStatus });
    it(`Open ${_shortName} repay view`, () => {
      cy.get('.Menu strong').contains('dashboard').click();
      getDashBoardBorrowRow({ assetName: _shortName }).contains('Repay').click();
    });
    it(`Choose ${repayOption} repay option`, () => {
      switch (repayOption) {
        case constants.repayType.collateral:
          cy.get('.ButtonLink').contains('With your current collateral').click();
          break;
        case constants.repayType.wallet:
          cy.get('.ButtonLink').contains('From your wallet balance').click();
          break;
        case constants.repayType.default:
          break;
        default:
          cy.get('.ButtonLink').contains('From your wallet balance').click();
          break;
      }
    });
    it(`Set ${amount} repay amount for ${_shortName}, with ${repayOption} repay option`, () => {
      switch (repayOption) {
        case constants.repayType.collateral:
          doSwapForRepay({ amount, assetName: _shortNameAssetForRepay });
          break;
        case constants.repayType.wallet:
          setAmount({ amount });
          break;
        case constants.repayType.default:
          setAmount({ amount });
          break;
      }
    });
    it(`Make approve for ${_shortName}, on confirmation page`, () => {
      doConfirm({ hasApproval, actionName: 'Repay' });
    });
  });
};

export const withdraw = (
  {
    asset,
    amount,
    hasApproval = false,
  }: {
    asset: { shortName: string; fullName: string };
    amount: number;
    hasApproval: boolean;
  },
  skip: SkipType,
  updateSkipStatus = false
) => {
  let _shortName = asset.shortName;
  return describe(`Withdraw process for ${_shortName}`, () => {
    skipSetup({ skip, updateSkipStatus });
    it(`Open ${_shortName} repay view`, () => {
      cy.get('.Menu strong').contains('dashboard').click();
      getDashBoardDepositRow({ assetName: _shortName }).contains('Withdraw').click();
    });
    it(`Set ${amount} withdraw amount for ${_shortName}`, () => {
      setAmount({ amount });
    });
    it(`Make approve for ${_shortName}, on confirmation page`, () => {
      doConfirm({ hasApproval, actionName: 'Withdraw' });
    });
  });
};

export const changeBorrowType = (
  {
    asset,
    apyType,
    newAPY,
    hasApproval = true,
  }: {
    asset: { shortName: string; fullName: string };
    apyType: string;
    newAPY: string;
    hasApproval: boolean;
  },
  skip: SkipType,
  updateSkipStatus = false
) => {
  let _shortName = asset.shortName;

  describe('Change APY of borrowing', () => {
    skipSetup({ skip, updateSkipStatus });
    it(`Change the ${_shortName} borrowing apr type from ${apyType} to ${newAPY}`, () => {
      cy.get('.Menu strong').contains('dashboard').click();
      getDashBoardBorrowRow({ assetName: _shortName, apyType }).find('.Switcher__swiper').click();
    });
    it(`Make approve for ${_shortName}, on confirmation page`, () => {
      doConfirm({ hasApproval, actionName: 'Submit' });
    });
  });
};
