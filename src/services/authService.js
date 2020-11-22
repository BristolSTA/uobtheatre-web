import api from '@/services/api';

export default {
    login(email, password) {
      return api
        .post('api-token-auth/',{"email":email, "password":password})
        .then((response) => console.log(response));
    },
  };
  