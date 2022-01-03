const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password, username} = req.body;
            const userData = await userService.registration(email, password, username);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    
//update user
 async updateUser(req, res) {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
          return res.status(500).json(err);
        }
      }
      try {
        const user = await userService.updUser(req.params.id, req.body);
        return user

      } catch (e) {
        next(e);
        // return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can update only your account!");
    }
  };
  
  //delete user
  async deleteUser(req, res) {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      try {
        const user = await userService.removeUser(req.params.id,);
        return user
      } catch (e) {
        next(e);
        }
    //   catch (err) {
    //     return res.status(500).json(err);
    //   }
    } else {
      return res.status(403).json("You can delete only your account!");
    }
  };
  
  //get a user
  async getUser(req, res) {
    try {
        const user = await userService.printUser(req.query.userId, req.query.username);
        return user
    } catch (err) {
      res.status(500).json(err);
    }
  };
 
  //get friends
  async getFriends(req, res) {
    try {
        const friensList = await userService.printFriends(req.params.userId);
        return friensList
    } catch (err) {
      res.status(500).json(err);
    }
  };
  
  //follow a user
  
 async putFollowUser(req, res) {
    if (req.body.userId !== req.params.id) {
      try {
        const follow = await userService.followUser(req.params.id, req.body.userId);
        return follow
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant follow yourself");
    }
  };
  
  //unfollow a user
  
async putUnfollowUser(req, res) {
    if (req.body.userId !== req.params.id) {
      try {
        const unfollow = await userService.unfollowUser(req.params.id, req.body.userId);
        return unfollow
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  };



}


module.exports = new UserController();
