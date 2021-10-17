<template>
  <div class="app-container">
    <h3>Main banner</h3>
    <el-carousel indicator-position="outside" trigger="click">
      <el-carousel-item v-for="item in banners" :key="item.id">
        <div v-bind:style="bgStyle(item)">
          <h1 class="banner-title">
            {{item.title}}
          </h1>
          <div style="width: 50%">
          <p class="banner-desc">
            {{item.description}}
          </p>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <el-table
      :data="banners"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50"
      >
      </el-table-column>
      <el-table-column
        label="Title"
        prop="title">
      </el-table-column>
      <el-table-column
        label="Filename"
        prop="filename">
      </el-table-column>
      <el-table-column
        label="Upload date"
        prop="created_at">
      </el-table-column>
      
      <el-table-column
        align="right">
        <template slot="header" >
        <el-button type="success" size="mini" @click="handleAdd" >
            <i class="el-icon-plus"></i>
        </el-button>
      </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete"></i></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogForm" width="80%">
      <el-form ref="form" :model="form" label-width="120px" label-position="top">
        <el-form-item label="Banner image">
          <el-upload
            class="avatar-uploader"
            action="#"
            ref="file"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="onFileChange"
            accept="image/jpeg,image/png"
            >
            <img v-if="url" :src="url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="Title">
          <el-input type="textarea" v-model="form.title" maxlength="250"></el-input>
        </el-form-item>
        <el-form-item label="Description">
          <el-input type="textarea" v-model="form.description" maxlength="250"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogForm = false">Cancel</el-button>
        <el-button type="primary" @click="submitDialog">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      API_URL: 'http://localhost',
      tableData: [],
      search: '',
      dialogFormVisible: false,
      form: {
        title: '',
        description: ''
      },
      formLabelWidth: '120px',
      banners : [
        {id: 1, filename: 'http://localhost/images/bigbanner01.jpg'},
        {id: 2, filename: 'http://localhost/images/bigbanner02.jpg'},
        {id: 3, filename: 'http://localhost/images/bigbanner03.jpg'},
      ],
      editIndex: -1,
      dialogTitle: '',
      dialogForm: false,
      url : ''
    }
  },
  created(){
    var url = window.location.href.split('://')
    url[1] = url[1].split('/').shift()
    url[1] = url[1].split(':').shift()
    this.API_URL = url.join('://')
  },
  async mounted(){
    let result = await axios.get(this.API_URL+'/banner/list')
    var banner_list = result.data.data
    for(let item of banner_list){
      item.created_at = item.created_at.split('T')[0]
      item.filepath = this.API_URL+'/images/uploads/'+item.filename
    }
    this.banners = banner_list
  },
  methods: {
    async submitDialog(){
      this.dialogForm = false
      let msg = 'Success'
      let formdata = new FormData()
      formdata.append('title', this.form.title)
      formdata.append('description', this.form.description)

        if(this.form.title && this.form.description){
          var today = new Date()
          if(this.editIndex < 0){
            //ADD
            if(this.file) formdata.append('file', this.file)
            let result = await axios.post(this.API_URL+'/banner/add', formdata)
            if(result.data.data.insertId){
              this.banners.push({
                id: result.data.data.insertId,
                filename: result.data.data.filename,
                filepath: this.API_URL+'/images/uploads/'+result.data.data.filename,
                title: this.form.title,
                description: this.form.description,
                created_at: today.toISOString().split('T')[0]
              })
            }
            msg = 'Add banner completed'
          }else{
            //EDIT
            
            formdata.append('id', this.banners[this.editIndex].id)
            if(this.file) formdata.append('file', this.file)
            let result = await axios.post(this.API_URL+'/banner/update', formdata)
            if(result.data.data.affectedRows){
              this.banners[this.editIndex].title = this.form.title
              this.banners[this.editIndex].description = this.form.description
              if(this.file){
                var new_filename = this.file.name.split('.').join('-bn-'+today.getHours()+'.')
                this.banners[this.editIndex].filename = new_filename
                this.banners[this.editIndex].filepath = this.API_URL+'/images/uploads/'+new_filename
              }
              this.banners[this.editIndex].created_at = today.toISOString().split('T')[0]
            }
            msg = 'Update banner completed'
          }
        }
      this.$message({
          type: 'success',
          message: msg
        });
      this.dialogForm = false
    },
    handleAdd(){
      this.editIndex = -1
      this.dialogTitle = 'Add banner'
      this.file = null
      this.url = ''
      this.form = {
        title: '',
        description: ''
      }
      this.dialogForm = true
    },
    handleEdit(index, row) {
      this.editIndex = index
      this.dialogTitle = 'Edit banner'
      this.file = null
      this.url = row.filepath
      this.form = {
        title: row.title,
        description: row.description
      }
      this.dialogForm = true
    },
    handleDelete(index, row) {
      this.$confirm('Delete ?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        axios.post(this.API_URL+'/banner/remove', row)
        this.banners.splice(index, 1)
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
    },
    onFileChange(e) {
      this.$refs.file.clearFiles()
      this.file = e.raw;
      this.url = URL.createObjectURL(this.file);
    },
    bgStyle(img){
      return {
        height: '100%',
        backgroundImage: `url('${img.filepath}')`,
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat'
      }
    }
  },
}
</script>

<style>
  .el-carousel__container{
    height: 450px !important;
  }
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
  .banner-title {
    margin-top: 0px;
    padding-top: 100px;
    padding-left: 50px;
    color: white;
  }
  .banner-desc {
    padding-left: 50px;
    color: white;
  }
  .image {
    width: 100%;
    display: block;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100%;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 500px;
    display: block;
  }
</style>