import React from 'react';
import { useIntl } from 'react-intl';

// import TableItem from '../../../../components/BasicAssetsTable/TableItem';

import TableItem from '../../../dashboard/components/DashboardTable/TableItem';
import TableColumn from '../../../../components/BasicTable/TableColumn';
import Value from '../../../../components/basic/Value';
import NoData from '../../../../components/basic/NoData';
import { isAssetStable } from '../../../../helpers/config/assets-config';
import CapsHint from '../../../../components/caps/CapsHint';
import { CapType } from '../../../../components/caps/helper';

import { SupplyTableItem } from './types';
import TableButtonsWrapper from '../../../dashboard/components/DashboardTable/TableButtonsWrapper';
import TableButtonCol from '../../../dashboard/components/DashboardTable/TableButtonCol';
import messages from './messages';
// import TableValueCol from '../../../dashboard/components/DashboardTable/TableValueCol';
import TableAprCol from '../../../dashboard/components/DashboardTable/TableAprCol';

export default function SupplyItem({
  id,
  symbol,
  underlyingAsset,
  availableToDeposit,
  availableToDepositUSD,
  liquidityRate,
  userId,
  isFreezed,
  aIncentives,
  isIsolated,
  totalLiquidity,
  supplyCap,
  uiColor,
  isActive,
}: SupplyTableItem) {
  const intl = useIntl();

  return (
    <TableItem tokenSymbol={symbol} isIsolated={isIsolated}>
      <TableColumn>
        {!userId || Number(availableToDeposit) <= 0 ? (
          <NoData color="dark" />
        ) : (
          <Value
            value={availableToDeposit}
            subValue={availableToDepositUSD}
            maximumSubValueDecimals={2}
            subSymbol="USD"
            maximumValueDecimals={isAssetStable(symbol) ? 2 : 5}
            minimumValueDecimals={isAssetStable(symbol) ? 2 : 5}
            nextToValue={
              <CapsHint
                capType={CapType.supplyCap}
                capAmount={supplyCap}
                totalAmount={totalLiquidity}
                tooltipId={`supplyCap__${id}`}
                withoutText={true}
              />
            }
          />
        )}
      </TableColumn>

      {/* <TableValueCol
        value={Number(availableToDeposit)}
        subValue={Number(availableToDepositUSD)}
        tooltipId={`deposit-${symbol}__${id}`}
      /> */}

      <TableAprCol value={Number(liquidityRate)} incentives={aIncentives} symbol={symbol} />

      <TableButtonsWrapper>
        <TableButtonCol
          disabled={!isActive || isFreezed}
          title={intl.formatMessage(messages.supply)}
          linkTo={`/deposit/${underlyingAsset}-${id}`}
        />
      </TableButtonsWrapper>
    </TableItem>
  );
}
