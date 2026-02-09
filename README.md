# TalkMates Circle Website（公開サイト + 幹部ページ）

**本番URL**：https://talkmates-circle.com  
（補足）幹部ログイン：`/admin/login` ※スタッフ専用

---

## 初めに
本リポジトリは、**同志社大学の国際交流サークル「TalkMates」** の集客向けWebサイトです。  
幹部として運用する中で、参加導線と資料共有がLINE中心で分散し、継続的に活用しづらい課題を感じたため制作しました。

公開サイトでは、次回/過去イベントをカード形式で分かりやすく掲載し、参加のハードルを下げます。  
またスタッフ専用ページを用意し、企画書・報告書などのPDFを一元管理できるようにしています。


---

## コンセプト
- **初見の人でも1分で雰囲気が分かり、参加に繋がるサイト**
- **幹部側は運用資料（PDF）を散逸させず、素早く参照できる仕組み**

---

## 概要
### 公開ページ
- Next Event / Past Events をカード形式で表示
- イベント詳細ページ（`/events/:slug`）で内容を表示
- 言語切替（現状：EN/JA）

### 幹部ページ（スタッフ専用）
- `Supabase Auth` によるログイン
- PDFの一覧表示（`Supabase Storage` + DBのメタ情報）

---

## デモ画像

- Home
- Events
- Event Detail
- Admin Login
- Admin Dashboard（PDF一覧）

（例）
<!-- ![Home](docs/home.png) -->

---

## 使用技術一覧
### Frontend
- React
- Vite
- Tailwind CSS
- React Router

### Backend / Database
- Supabase（PostgreSQL / Auth / Storage）
- 権限制御

### Infrastructure / Deploy
- AWS S3（静的ホスティング）
- AWS CloudFront
- AWS Route 53
- AWS ACM（HTTPS証明書）

### Tools
- Git / GitHub
---
## 学んだこと
- **フロントエンド ↔ データベース（Supabase/PostgreSQL） ↔ デプロイ（AWS S3/CloudFront）** のつながりを、実装〜公開まで通して体験的に理解しました。
- 画面表示の裏側で、**状態管理・非同期処理（データ取得）・条件分岐**がどうUIに影響するかを意識して実装できるようになりました。


---

## 構成（アーキテクチャ）
- Browser → **CloudFront** → **S3**（静的配信 / 独自ドメイン / HTTPS）
- Browser → **Supabase**
  - DB：events / staff_documents など
  - Auth：幹部ログイン
  - Storage：PDF保管（bucket）

---

## 実装予定の機能
- 参加希望フォーム（Google Form から自作フォームへ移行し、Supabaseに保存）
- 幹部ページからPDFアップロード（UIから追加できる運用）
  
  (私が幹部唯一のエンジニアなので、非エンジニアでもアップロードできるようにしたい)
- Search Console 登録

---
