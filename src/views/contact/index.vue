<template>
  <div class="app-container">
    <h3>Contact</h3>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="Date"
        prop="date">
      </el-table-column>
      <el-table-column
        label="Name"
        prop="name">
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

    <el-dialog title="Add Service" :visible.sync="dialogView" width="80%">
      <el-form :model="form">
        <wysiwyg  v-model="form.body" />
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogView = false">Cancel</el-button>
        <el-button type="primary" @click="addService">Confirm</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Contact detail" :visible.sync="dialogFormVisible">
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">Confirm</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
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
      banners : [
        {id: 1, filename: 'http://localhost/image/bigbanner01.jpg'},
        {id: 2, filename: 'http://localhost/image/bigbanner02.jpg'},
        {id: 3, filename: 'http://localhost/image/bigbanner03.jpg'},
      ],
      dialogView: false
    }
  },
  mounted(){
    
  },
  methods: {
    handleAdd(){
        this.dialogAdd = true
        this.form = {
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: '',
            body: ''
        }
    },
    addService(){
        this.dialogAdd = false
        // let formdata = new FormData()
        axios.post(this.$store.state.app.API_URL+'/service/add', this.form.body)
        console.log(this.form.body)
    },
    handleView(index, row) {
      console.log(index, row)
      this.dialogView = true
    },
    handleDelete(index, row) {
      this.$confirm('Delete ?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: 'Delete completed'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        });          
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