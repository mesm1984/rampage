const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        args: true,
        msg: 'Ce nom d\'utilisateur est déjà utilisé',
      },
      validate: {
        notEmpty: {
          msg: 'Le nom d\'utilisateur est requis',
        },
        len: {
          args: [3, 50],
          msg: 'Le nom d\'utilisateur doit contenir entre 3 et 50 caractères',
        },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        args: true,
        msg: 'Cet email est déjà utilisé',
      },
      validate: {
        isEmail: {
          msg: 'Veuillez fournir une adresse email valide',
        },
        notEmpty: {
          msg: 'L\'email est requis',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le mot de passe est requis',
        },
        len: {
          args: [8],
          msg: 'Le mot de passe doit contenir au moins 8 caractères',
        },
      },
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    last_login: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  });

  // Méthode pour vérifier le mot de passe
  User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  // Méthode pour masquer le mot de passe lors de la sérialisation
  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  return User;
};
