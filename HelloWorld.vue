<template>
  <div class="hello">
    <el-row type="flex" class="row-bg">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>testV1</span>
          </div>
          <div class="text item">
            <el-row>
              <div style="margin-top: 15px">
                <el-input placeholder="请输入内容" v-model="input1">
                  <template slot="prepend">param</template>
                </el-input>
              </div>
                <br />
                <br />
              <el-button type="warning" @click="SetUint256Param()">SetUint256Param</el-button>
              <div style="margin-top: 15px">
                <el-input placeholder="请输入内容" v-model="input2">
                  <template slot="prepend">param</template>
                </el-input>
                <br />
                <br />
                <el-button type="info" @click="GetUint256Param()">GetUint256Param</el-button>
                <br />
                <br />
                <el-alert title="结果" type="success" :description="result"> </el-alert>
              </div>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>testV2</span>
          </div>
          <div class="text item">
            <el-row>
              <div style="margin-top: 15px">
                <el-input placeholder="请输入内容" v-model="param1">
                  <template slot="prepend">param</template>
                </el-input>
              </div>
                <br />
                <br />
              <el-button type="warning" @click="SetUint256Param2()">SetUint256Param</el-button>
              <div style="margin-top: 15px">
                <el-input placeholder="请输入内容" v-model="param2">
                  <template slot="prepend">param</template>
                </el-input>
                <br />
                <br />
                <el-button type="info" @click="GetUint256Param2()">GetUint256Param</el-button>
                <br />
                <br />
                <el-alert title="结果" type="success" :description="result2"> </el-alert>
              </div>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import walletObj from "j_wallet_sdk";

export default {
  name: "HelloWorld",
  props: {},
  data() {
    return {
      objContract: {},
      input1:'',
      input2:'',
      result:'',
      param1:'',
      param2:'',
      result2:'',
    };
  },
  async created() {
    console.log("加载中……");
    this.objContract["testV1"] = await walletObj.getContract(
      "testV1",
      "testProxy"
    );
    console.log("代理加载合约对象testV1成功");
    this.objContract["testV2"] = await walletObj.newContract(
      "testV2",
      "testProxy"
    );
    console.log("代理加载合约对象testV2成功");
  },
  methods: {
    async SetUint256Param(){
      let param =  this.input1.split(',')
      this.objContract['testV1'].SetUint256Param(param[0],parseInt(param[1]))
    },
    async GetUint256Param(){
      this.result = await this.objContract['testV1'].GetUint256Param(this.input2)
    },
    async SetUint256Param2(){
      let param =  this.param1.split(',')
      this.objContract['testV2'].sendMethod('SetUint256Param',0,0,param[0],parseInt(param[1]))
    },
    async GetUint256Param2(){
      this.result2 = await this.objContract['testV2'].callMethod('GetUint256Param',this.param2)
    }
  }
};
</script>
