import { RootState } from "./../../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/api";

interface SaleDate {
  saleStartDay: Date; // 판매 시작일
  saleEndDay: Date; // 판매 종료일
}

export interface Metadata {
  fileName: string;
  name: string;
  author: string;
  description: string;
  imageURL: string;
}

export interface NftConfig {
  metaDataURI: string;
  readmeTokenId: string;
  readmeTokenOwner: string;
  readmeTokenPrice: number;
  metaData: Metadata | undefined;
  saleDate: SaleDate | undefined;
}

interface NftListConfig {
  rawList: any[];
  nftList: NftConfig[];
  solveList: number[];
  status: "idle" | "loading" | "failed";
}

const initialState: NftListConfig = {
  rawList: [],
  nftList: [],
  solveList: [],
  status: "idle",
};
export const postProblem = createAsyncThunk("", () => {});

export const findSolveList = createAsyncThunk("nft/findSolveList", async ({ userAddress }: any, { rejectWithValue }) => {
  try {
    const response = await axios.get(api.solver.getSolveList(userAddress));
    return response.data;
  } catch (err) {
    return rejectWithValue(err);
  }
});

const nftSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    setRawList: (state, { payload }) => {
      state.rawList = payload;
    },
    setNftList: (state, { payload }) => {
      state.nftList = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(findSolveList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(findSolveList.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.solveList = payload.nftList;
        console.log(state.solveList);
      })
      .addCase(findSolveList.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setRawList, setNftList } = nftSlice.actions;

export default nftSlice.reducer;

export const selectRawList = (state: RootState) => state.nft.rawList;
export const selectNftList = (state: RootState) => state.nft.nftList;
export const selectSolveList = (state: RootState) => state.nft.solveList;
