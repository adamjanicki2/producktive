import type { Request, Response, NextFunction } from "express";
import UserCollection from "../user/collection";

/**
 * Checks if the current session user (if any) still exists in the database, for instance,
 * a user may try to post a freet in some browser while the account has been deleted in another or
 * when a user tries to modify an account in some browser while it has been deleted in another
 */
const isCurrentSessionUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req.session as any).userId) {
    const user = await UserCollection.findOneByUserId(
      (req.session as any).userId
    );

    if (!user) {
      (req.session as any).userId = undefined;
      res.status(500).json({
        error: {
          userNotFound: "User session was not recognized.",
        },
      });
      return;
    }
  }

  next();
};

/**
 * Checks if a username in req.body is valid, that is, it matches the username regex
 */
const isValidUsername = (req: Request, res: Response, next: NextFunction) => {
  const usernameRegex = /^\w+$/i;
  if (!usernameRegex.test(req.body.username)) {
    res.status(400).json({
      error: {
        username: "Username must be a nonempty alphanumeric string.",
      },
    });
    return;
  }

  next();
};

/**
 * Checks if a email in req.body is valid, that is, it matches the email regex
 */
const isValidEmail = (req: Request, res: Response, next: NextFunction) => {
  const emailRegex = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/g;
  if (!emailRegex.test(req.body.email)) {
    res.status(400).json({
      error: {
        email: "Email must be a valid email!",
      },
    });
    return;
  }

  next();
};
/**
 * Checks if a password in req.body is valid, that is, at 6-50 characters long without any spaces
 */
const isValidPassword = (req: Request, res: Response, next: NextFunction) => {
  const passwordRegex = /^\S+$/;
  if (!passwordRegex.test(req.body.password)) {
    res.status(400).json({
      error: {
        password: "Password must be a nonempty string.",
      },
    });
    return;
  }

  next();
};

/**
 * Checks if a user with username and password in req.body exists
 */
const isAccountExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  if (!email || !password) {
    res.status(400).json({
      error: `Missing ${email ? "password" : "email"} credentials for sign in.`,
    });
    return;
  }

  const user = await UserCollection.findOneByEmailAndPassword(email, password);

  if (user) {
    next();
  } else {
    res.status(401).json({ error: "Invalid user login credentials provided." });
  }
};

/**
 * Checks if a username in req.body is already in use
 */
const isUsernameNotAlreadyInUse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await UserCollection.findOneByUsername(req.body.username);

  // If the current session user wants to change their username to one which matches
  // the current one irrespective of the case, we should allow them to do so
  if (!user || user?._id.toString() === (req.session as any).userId) {
    next();
    return;
  }

  res.status(409).json({
    error: {
      username: "An account with this username already exists.",
    },
  });
};

/**
 * Checks if the user is logged in, that is, whether the userId is set in session
 */
const isUserLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!(req.session as any).userId) {
    res.status(403).json({
      error: {
        auth: "You must be logged in to complete this action.",
      },
    });
    return;
  }

  next();
};

/**
 * Checks if the user is signed out, that is, userId is undefined in session
 */
const isUserLoggedOut = (req: Request, res: Response, next: NextFunction) => {
  if ((req.session as any).userId) {
    res.status(403).json({
      error: "You are already signed in.",
    });
    return;
  }

  next();
};

/**
 * Checks if a email in req.body is already in use
 */
 const isEmailNotAlreadyInUse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await UserCollection.findOneByEmail(req.body.email);

  // If the current session user wants to change their username to one which matches
  // the current one irrespective of the case, we should allow them to do so
  if (!user) {
    next();
    return;
  }

  res.status(409).json({
    error: {
      username: "An account with this email already exists.",
    },
  });
};

export {
  isCurrentSessionUserExists,
  isUserLoggedIn,
  isUserLoggedOut,
  isUsernameNotAlreadyInUse,
  isAccountExists,
  isValidUsername,
  isValidPassword,
  isValidEmail,
  isEmailNotAlreadyInUse
};
