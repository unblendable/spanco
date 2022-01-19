<template>
  <div class="app-container">
    <h3>Contact</h3>
    <el-table
      :data="contact_list"
      style="width: 100%">
      <el-table-column
        label="Date"
        prop="date">
      </el-table-column>
      <el-table-column
        label="Name"
        prop="fullname">
      </el-table-column>
      <el-table-column
        label="E-mail"
        prop="email">
      </el-table-column>
      <el-table-column
        label="Subject"
        prop="subject">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip 
        height="200"
        label="Message"
        prop="message">
      </el-table-column>
      <el-table-column
        align="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleView(scope.$index, scope.row)"><i class="el-icon-view"></i>
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="Contact" :visible.sync="dialogView" width="80%">
      <el-form :label-position="'top'" label-width="100px" >
        <el-form-item label="Date">
          {{dialogForm.date}}
        </el-form-item>
        <el-form-item label="Name">
          {{dialogForm.fullname}}
        </el-form-item>
        <el-form-item label="E-mail">
          {{dialogForm.email}}
        </el-form-item>
        <el-form-item label="Subject">
          {{dialogForm.subject}}
        </el-form-item>
        <el-form-item label="Message">
          {{dialogForm.message}}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogView = false">Close</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      API_URL: 'localhost',
      tableData: [{
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }, {
        date: '2016-05-02',
        name: 'John',
        address: 'No. 189, Grove St, Los Angeles'
      }, {
        date: '2016-05-04',
        name: 'Morgan',
        address: 'No. 189, Grove St, Los Angeles'
      }, {
        date: '2016-05-01',
        name: 'Jessy',
        address: 'No. 189, Grove St, Los Angeles'
      }],
      search: '',
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        body: ''
      },
      formLabelWidth: '120px',
      contact_list : [],
      dialogView: false,
      dialogForm: {}
    }
  },
  created(){
    var url = window.location.href.split('://')
    url[1] = url[1].split('/').shift()
    url[1] = url[1].split(':').shift()
    this.API_URL = url.join('://')
  },
  mounted(){
    this.contact_list = []
    axios.get(this.API_URL+'/contact/contact_list').then((response)=>{
      if(response.data.data){
        for(let item of response.data.data){
          item.date = item.created_at.split('T')[0]
        }
        this.contact_list = response.data.data
      }
    })
  },
  methods: {
    handleAdd(){
        this.dialogAdd = true
        this.form = {}
    },
    handleView(index, row) {
      this.dialogForm = row
      this.dialogView = true
    },
    handleDelete(index, row) {
      this.$confirm('Delete ?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        axios.post(this.API_URL+'/contact/contact_del', {id: row.id}).then((response)=>{
          if(response.status === 200){
            this.$message({
              type: 'success',
              message: 'Delete completed'
            });
            this.contact_list.splice(index, 1)
          }
        })
        
      }).catch(() => {
              
      });
    }
  },
}
</script>

<style>
@import "~vue-wysiwyg/dist/vueWysiwyg.css";
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .image {
    width: 100%;
    display: block;
  }
</style>