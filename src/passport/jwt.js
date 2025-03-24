import passport from "passport";
import local from 'passport-local';
import { createHash } from "../utils.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import "dotenv/config";
import { userService } from "../services/user.services.js";
const LocalStrategy = local.Strategy;
//Strategy para Headers + JWT
const strategyJWT = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extraer el JWT del encabezado como Bearer
  secretOrKey: process.env.SECRET_KEY,  // Usa el valor de SECRET_KEY de tu archivo .env
};

const verifyToken = async (jwt_payload, done) => {
  console.log("Token decodificado:", jwt_payload); // 🔍 Verifica que tenga un campo 'role'
  
  if (!jwt_payload) return done(null, false, { message: "Usuario inexistente" });
  return done(null, jwt_payload);
};

passport.use('jwt', new JwtStrategy(strategyJWT, verifyToken)); // Usa la estrategia JWT con la clave secreta

const cookieExtractor = (req) => {
  return req.cookies.jwt;
};

const strategyCookiesConfig = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: process.env.SECRET_KEY,
};

passport.use('current', new JwtStrategy(strategyCookiesConfig, verifyToken));



const initializePassport = () => {
  passport.use('register', new LocalStrategy({
      usernameField: 'email',
      passReqToCallback: true
  }, async (req, email, password, done) => {
      try {
          const { first_name, last_name, age } = req.body;

          if (!first_name || !last_name || !age || !email || !password) {
              return done(null, false, { message: "All fields are required" });
          }
          //Null pq no hay error tecnico del servidor, false pq no se registro el usuario, mensaje...

          let userExists = await userService.getByEmail(email);

          if (userExists) {
              return done(null, false, { message: 'Email already in use.' });
          }

          const newUser = {
              first_name,
              last_name,
              email,
              age,
              password: createHash(password),
          };

          const user = await userService.register(newUser);
          return done(null, user);
      } catch (error) {
          return done(error);
      }
  }));

  passport.serializeUser((user, done) => {
      done(null, user._id); // Guarda solo el ID del usuario
  });

  // Deserializar usuario (recuperar el usuario de la base de datos por ID)
  passport.deserializeUser(async (id, done) => {
      let user = await userService.getById(id); // Busca el usuario por su ID
      done(null, user); // Devuelve el usuario completo a req.user
  });


};

export default initializePassport;