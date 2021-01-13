<template>
    <div class="container center-all emp-profile">
        <div class="row">
          <div class="col-md-12">
            <div class="profile-img">
              <img
                :src="$auth.user.picture"
                alt=""
              />
            </div>
          </div>
        </div>
        <div class="row card mt-3 panel-info p-3">
          <div class="col-md-12">
            <div class="tab-content profile-tab">
                <div class="row">
                  <div class="col-md-6">
                    <label>Name</label>
                  </div>
                  <div class="col-md-6">
                    <p>{{ $auth.user.name }}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <label>Email</label>
                  </div>
                  <div class="col-md-6">
                    <p>{{ $auth.user.email }}</p>
                  </div>
                </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style>

.center-all {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.panel-info {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  width:500px;
}
.emp-profile {
  padding: 3%;
  margin-top: 3%;
  margin-bottom: 3%;
  border-radius: 0.5rem;
  background: #fff;
}
.profile-img {
  text-align: center;
}
.profile-img img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.profile-head .nav-tabs .nav-link.active {
  border: none;
  border-bottom: 2px solid #0062cc;
}
.profile-work {
  padding: 14%;
  margin-top: -15%;
}
.profile-work p {
  font-size: 12px;
  color: #818182;
  font-weight: 600;
  margin-top: 10%;
}
.profile-work a {
  text-decoration: none;
  color: #495057;
  font-weight: 600;
  font-size: 14px;
}
.profile-work ul {
  list-style: none;
}
.profile-tab label {
  font-weight: 600;
}
.profile-tab p {
  font-weight: 600;
  color: #0062cc;
}
</style>
