import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { hasApprovedTShare, approveTShare, depositTShare } from "../api/vault";

export default function Stake({ tshareBalance, vaultBalance }) {
  const [state, setState] = useState({
    stakeTShareAmount: 0,
    hasApprovedTShare: null,
  });

  useEffect(() => {
    if (state.hasApprovedTShare == null) {
      async function fetchHasApproved() {
        const hasApproved = await hasApprovedTShare();
        setState({ ...state, hasApprovedTShare: hasApproved });
      }
      fetchHasApproved();
    }
  });

  const amountChanged = (event) => {
    const newAmount = event.target.value;
    if (
      newAmount !== state.stakeTShareAmount &&
      newAmount >= 0 &&
      newAmount <= tshareBalance
    ) {
      setState({ ...state, stakeTShareAmount: newAmount });
    }
  };

  const stakeTShare = async () => {
    try {
      await depositTShare(state.stakeTShareAmount);
    } catch (error) {}
  };

  const handleApprove = async () => {
    const setHasApproved = (hasApproved) =>
      setState({ ...state, hasApprovedTShare: hasApproved });
    await approveTShare(setHasApproved);
  };

  return (
    <div>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>TShare in wallet: {tshareBalance}</div>
      </Stack>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>TShare staked: {vaultBalance}</div>
      </Stack>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>TShare amount to stake:</div>
        <TextField
          id="outlined-basic"
          label="TShare"
          variant="outlined"
          type="number"
          value={state.stakeTShareAmount}
          onChange={amountChanged}
        />
        <Button
          variant="outlined"
          onClick={handleApprove}
          disabled={state.hasApprovedTShare}
        >
          Approve
        </Button>
        <Button
          variant="outlined"
          onClick={stakeTShare}
          disabled={!state.hasApprovedTShare}
        >
          Stake
        </Button>
      </Stack>
    </div>
  );
}
