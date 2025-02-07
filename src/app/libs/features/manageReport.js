// tableDataSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const tableDataSlice = createSlice({
  name: "tableData",
  initialState: {
    data: [],       
    loading: false, 
    error: null,    
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTableData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTableData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; 
      })
      .addCase(fetchTableData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tableDataSlice.reducer;
