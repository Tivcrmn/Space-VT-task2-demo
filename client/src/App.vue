<template>
  <div id="app" class="content">
    <div class="row">
      <div class="col-lg-4 pl30">

        <div class="wrapForm">
          <h5 class="h2s">1. Choose timeSpan and the numType</h5>
          <div class="row">
            <div class="col-lg-1"></div>
            <div class="col-lg-4">
              <el-select v-model="timespan" placeholder="Please choose the timespan" size="small">
                <el-option
                  v-for="item in timespanOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="col-lg-1"></div>
            <div v-if="timespan !== 'day-hour'" class="col-lg-4">
              <el-select v-model="numType" placeholder="Please choose the numType" size="small">
                <el-option
                  v-for="item in numTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>

        <div class="wrapForm">
          <h5 class="h2s">2. Choose the element you want to show in canvas</h5>
          <el-select v-model="element" placeholder="Please choose the element" size="small" style="margin-left: 30px;">
            <el-option
              v-for="item in elementOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>

        <div class="wrapForm">
          <h5 class="h2s">3. Enter the time you want to compare</h5>
          <el-button type="text" @click="dialogVisible = true" style="margin-left: 10px">Click here for Input Rules</el-button>
          <el-input v-model="time" placeholder="please be careful about the format" class="ml10" size="mini" style="width: 300px"></el-input>
          <div class="message">
            <p class="red">The valid decimal day should between 1 to 365</p>
            <p class="red">(2012 and 2016 is leap year so the last decimalday is 366)</p>
            <p class="red">The valid month should between 1 to 12</p>
            <p class="red">The valid year should between 2011 to 2017</p>
          </div>
          <el-button type="primary" @click="fetch()" class="btn">fetch</el-button>
        </div>
      </div>

      <div class="col-lg-8 pr20 mb50">
        <p v-show="loading && timespan == 'day-hour'" class="fs30">Loading.......</p>
        <p v-show="loading && timespan == 'year-day'" class="fs30">Loading.......Retrieve the data of a year-day need more time。。。</p>
        <div class="fs30">Line chart for <span class="gray">{{ numType }} - {{element}}</span> in {{timespan}}</div>
        <canvas id="myChart" v-show="!loading"></canvas>
      </div>
    </div>



    <el-dialog
      title="Input Rules"
      :visible.sync="dialogVisible"
      width="30%">
      <div class="rules">
        For example, <br>
        <strong>if you choose day-hour as the timespan,</strong> <br>
        <span class="blue">2017-1</span> means <span class="red">the first day in 2017</span><br>
        <span class="blue">2017-1|2018-3</span> means <span class="red">the first day in 2017 and the third day in 2018</span><br>
        <strong>if you choose month-day as the timespan,</strong><br>
        <span class="blue">2017-1</span> means <span class="red">january in 2017</span><br>
        <span class="blue">2017-1|2018-3</span> means <span class="red">january in 2017 and march in 2018</span><br>
        <strong>if you choose year-day or year-month as the timespan,</strong><br>
        <span class="blue">2017</span><span class="red">  means 2017 based on day or month</span><br>
        <span class="blue">2017|2018</span><span class="red">  means 2017 and 2018 based on day or month</span><br>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  Input,
  Select,
  Option,
  Button,
  Dialog
} from 'element-ui'
import Chart from 'chart.js'
import opts from './const'
export default {
  name: 'app',
  data () {
    return {
      loading: false,
      timespan: 'year-month',
      time: '2017|2016|2015|2014|2013|2012|2011',
      element: 'Temperature',
      numType: 'avg',
      chart: null,
      dialogVisible: false,
      colors: opts.colors,
      timespanOptions: opts.timespanOptions,
      numTypeOptions: opts.numTypeOptions,
      elementOptions: opts.elementOptions
    }
  },
  components: {
    ElInput: Input,
    ElButton: Button,
    ElOption: Option,
    ElSelect: Select,
    ElDialog: Dialog
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      var params = this.validateInput()
      if (params == 'invalid') {
        alert('Please Enter the valid time')
        return
      }
      this.loading = true
      // http://ec2-54-186-112-54.us-west-2.compute.amazonaws.com
      this.$http.get('http://ec2-54-186-112-54.us-west-2.compute.amazonaws.com:5000/api/v1/imfdata', {params: params}).then(res => {
        var data = res.body.data
        var temp = this.processData(data)
        this.drawCanvas(temp)
        this.loading = false
      }, response => {
        // error callback
      });
    },
    validateInput () {
      var params = {
        element: this.element,
        timespan: this.timespan,
        time: this.time,
        numType: this.numType
      }
      var timeArray = params.time.split('|')
      if (this.timespan == 'day-hour' || this.timespan == 'month-day') {
        for (var i = 0; i < timeArray.length; i++) {
          timeArray[i] = timeArray[i].split('-')
          var days = parseInt(timeArray[i][0]) % 4 == 0 ? 366 : 365
          if (parseInt(timeArray[i][0]) < 2011 ||
              parseInt(timeArray[i][0]) > 2017) {
            return 'invalid'
          }
          if (params.timespan == 'day-hour') {
            if (parseInt(timeArray[i][1]) < 0 ||
                parseInt(timeArray[i][1]) > days) {
              return 'invalid'
            }
          } else if (params.timespan == 'month-day') {
            if (parseInt(timeArray[i][1]) < 0 ||
                parseInt(timeArray[i][1]) > 12) {
              return 'invalid'
            }
          }
        }
      } else if (this.timespan == 'year-day' || this.timespan == 'year-month') {
        for (var i = 0; i < timeArray.length; i++) {
          if (parseInt(timeArray[i]) < 2011 ||
              parseInt(timeArray[i]) > 2017) {
            return 'invalid'
          }
        }
      }
      return params
    },
    processData (data) {
      var labels = []
      var datasets = []
      var sortedDatas = []
      if (this.timespan == 'day-hour') {
        for (var i = 1; i <= 24; i++) {
          labels.push(i + '')
        }
        for (var i = 1; i <= data.length; i++) {
          sortedDatas.push(data[i - 1][this.element])
          if (i % 24 == 0) {
            datasets.push({
              label: data[i - 1]['Year'] + ' Year ' + data[i - 1]['DecimalDay'] + ' DecimalDay',
              data: sortedDatas
            })
            sortedDatas = []
          }
        }
      } else if (this.timespan == 'month-day') {
        for (var i = 1; i <= 31; i++) {
          labels.push(i)
        }
        for (var i = 0; i < data.length -  1; i++) {
          if (data[i]['_id']['Year'] != data[i + 1]['_id']['Year'] ||
              data[i]['_id']['Month'] != data[i + 1]['_id']['Month'] ||
              data[i]['_id']['DecimalDay'] == data[i + 1]['_id']['DecimalDay']) {
            sortedDatas.push(data[i][this.numType + 'Num'])
            datasets.push({
              label: data[i]['_id']['Year'] + ' Year ' + data[i]['_id']['Month'] + ' Month',
              data: sortedDatas
            })
            sortedDatas = []
          } else {
            sortedDatas.push(data[i][this.numType + 'Num'])
          }
        }
        sortedDatas.push(data[i][this.numType + 'Num'])
        datasets.push({
          label: data[i]['_id']['Year'] + ' Year ' + data[i]['_id']['Month'] + ' Month',
          data: sortedDatas
        })
      } else if (this.timespan == 'year-month') {
        for (var i = 1; i <= 12; i++) {
          labels.push(i)
        }
        for (var i = 0; i < data.length -  1; i++) {
          if (data[i]['_id']['Year'] != data[i + 1]['_id']['Year']) {
            sortedDatas.push(data[i][this.numType + 'Num'])
            datasets.push({
              label: data[i]['_id']['Year'] + ' Year ',
              data: sortedDatas
            })
            sortedDatas = []
          } else {
            sortedDatas.push(data[i][this.numType + 'Num'])
          }
        }
        sortedDatas.push(data[i][this.numType + 'Num'])
        datasets.push({
          label: data[i]['_id']['Year'] + ' Year ',
          data: sortedDatas
        })
      } else if (this.timespan == 'year-day') {
        for (var i = 1; i <= 366; i++) {
          labels.push(i)
        }
        for (var i = 0; i < data.length -  1; i++) {
          if (data[i]['_id']['Year'] != data[i + 1]['_id']['Year']) {
            sortedDatas.push(data[i][this.numType + 'Num'])
            datasets.push({
              label: data[i]['_id']['Year'] + ' Year ',
              data: sortedDatas
            })
            sortedDatas = []
          } else {
            sortedDatas.push(data[i][this.numType + 'Num'])
          }
        }
        sortedDatas.push(data[i][this.numType + 'Num'])
        datasets.push({
          label: data[i]['_id']['Year'] + ' Year ',
          data: sortedDatas
        })
      }
      for (var i = 0; i < datasets.length; i++) {
        datasets[i].backgroundColor = this.colors[i]
      }
      return {labels: labels, datasets: datasets}
    },
    drawCanvas (temp) {
      if (this.chart) {
        this.chart.destroy()
      }
      var ctx = document.getElementById("myChart").getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: temp.labels,
          datasets: temp.datasets
        },
        options: {}
      });
    }
  }
}
</script>

<style>
</style>
