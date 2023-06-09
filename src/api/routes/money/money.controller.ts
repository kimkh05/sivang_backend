import { NextFunction, Request, Response } from 'express';
import { error } from '../../../constants/error';
import { JWTHelper } from '../../../helper/jwt';
import { getAccessToken } from '../../../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { MoneyService } from '../../../service/money';

export const postMoney = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const moneyInfo = request.body;
    const jwtHelper: JWTHelper = new JWTHelper();
    const accessToken: string = getAccessToken(request.headers.authorization);
    const decodeAccessToken = jwtHelper.decodeAccessToken(accessToken);
    const { userId }: JwtPayload = decodeAccessToken as JwtPayload;
    const moneyInstance: MoneyService = new MoneyService();

    await moneyInstance.createMoneyPost({ userId, moneyInfo });

    response.status(201).json({ message: '가계부 작성 성공' });
  } catch (err: unknown) {
    console.error('가계부 작성 실패', err);
    response.status(500).json(error.userError.serverError);
    next(err);
  }
};

export const getMoney = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const jwtHelper: JWTHelper = new JWTHelper();
    const accessToken: string = getAccessToken(request.headers.authorization);
    const decodeAccessToken = jwtHelper.decodeAccessToken(accessToken);
    const { userId }: JwtPayload = decodeAccessToken as JwtPayload;
    const moneyInstance: MoneyService = new MoneyService();

    const moneyPostList = await moneyInstance.getMoneyPostList(userId);

    response.status(200).json({ message: '가계부 조회 성공', moneyPostList });
  } catch (err: unknown) {
    console.error('가계부 조회 실패', err);
    response.status(500).json(error.userError.serverError);
    next(error);
  }
};

export const getMoneyItem = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const jwtHelper: JWTHelper = new JWTHelper();
    const accessToken: string = getAccessToken(request.headers.authorization);
    const decodeAccessToken = jwtHelper.decodeAccessToken(accessToken);
    const { userId }: JwtPayload = decodeAccessToken as JwtPayload;
    const moneyId = Number(request.params.id);
    const moneyInstance: MoneyService = new MoneyService();
    const moneyPost = await moneyInstance.findMoneyPost(moneyId, userId);

    response.status(200).json({ message: '가계부 아이템 조회 성공', moneyPost });
  } catch (err: unknown) {
    console.error('가계부 아이템 조회 실패', err);
    response.status(500).json(error.userError.serverError);
    next(error);
  }
};

export const modifyMoneyItem = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const modifyInfo = request.body;
    const jwtHelper: JWTHelper = new JWTHelper();
    const accessToken: string = getAccessToken(request.headers.authorization);
    const decodeAccessToken: JwtPayload = jwtHelper.decodeAccessToken(accessToken);
    const { userId }: JwtPayload = decodeAccessToken as JwtPayload;
    const moneyId = Number(request.params.id);
    const moneyInstance: MoneyService = new MoneyService();

    await moneyInstance.updateMoneyPost({ userId, moneyId, moneyInfo: modifyInfo });

    response.status(200).json({ message: '가계부 아이템 수정 성공' });
  } catch (err: unknown) {
    console.error('가계부 아이템 수정 실패', err);
    response.status(500).json(error.userError.serverError);
    next(error);
  }
};
