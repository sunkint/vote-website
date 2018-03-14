<template>
  <header>
    <h1><img src="../../assets/icon.png" alt="Logo"> 砾风小投票 <sup>beta</sup></h1>
  </header>
</template>

<script>
export default {
  
}
</script>

<style lang="less" scoped>
header {
  text-align: center;
  letter-spacing: 2px;
  color: #333;
  
  h1 {
    font-size: 30px;
    margin: 20px 0 10px;

    img {
      width: 28px;
      height: 28px;
      vertical-align: -3px;
    }

    sup {
      position: relative;
      line-height: 1;
      font-size: 14px;
      color: #777;
      top: -15px;
      left: -2px;
      letter-spacing: 0;
      vertical-align: baseline;
    }
  }
}
</style>