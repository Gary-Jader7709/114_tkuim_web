import { Router } from 'express';
import { nanoid } from 'nanoid';

export const router = Router();

// 假資料庫（存在記憶體）
const participants = [];

function validate(body) {
  if (!body.name) return 'name 必填';
  if (!body.email) return 'email 必填';
  if (!body.phone) return 'phone 必填';
  if (!/^09\d{8}$/.test(body.phone)) return '手機格式需為 09 開頭 10 碼';
  if (!body.password) return 'password 必填';
  if (body.password.length < 8) return '密碼至少需要 8 碼';
  if (body.password !== body.confirmPassword) return '密碼與確認密碼不一致';

  if (!Array.isArray(body.interests) || body.interests.length === 0)
    return '至少選擇一個興趣';

  if (body.terms !== true) return '請勾選同意條款';

  return null;
}

router.get('/', (req, res) => {
  res.json({ total: participants.length, data: participants });
});

router.post('/', (req, res) => {
  const error = validate(req.body || {});
  if (error) return res.status(400).json({ error });

  const user = {
    id: nanoid(8),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    interests: req.body.interests,
    createdAt: new Date().toISOString()
  };

  participants.push(user);

  res.status(201).json({
    message: '報名成功',
    participant: user
  });
});
