# S3 Product Image Storage

Status: Implemented

Owner: Backend Architect

Date: 2026-07-13

## Environment

Required application configuration:

| Variable | Purpose |
| --- | --- |
| `PRODUCT_WRITE_API_KEY` | At least 32 characters; authenticates the administrative upload endpoint. |
| `AWS_REGION` | Region containing the S3 bucket, for example `us-east-1`. |
| `AWS_S3_BUCKET` | Destination bucket name. |
| `AWS_S3_PUBLIC_BASE_URL` | Delivery origin without trailing slash, normally a CloudFront domain or approved public asset origin. |

Optional configuration:

| Variable | Default | Purpose |
| --- | --- | --- |
| `AWS_S3_IMAGE_PREFIX` | `images/products` | Object-key namespace. |
| `AWS_S3_IMAGE_MAX_BYTES` | `5242880` | Maximum bytes per file; hard ceiling is 20 MiB. |
| `AWS_S3_KMS_KEY_ID` | unset | KMS key ID/ARN/alias; when absent S3 AES-256 is used. |
| `AWS_ACCESS_KEY_ID` | credential chain | Static credential only when the runtime has no IAM Role. |
| `AWS_SECRET_ACCESS_KEY` | credential chain | Secret paired with the static access key. |
| `AWS_SESSION_TOKEN` | unset | Required only for temporary static credentials. |

Production should use an IAM Role rather than persisted access keys. The role
needs `s3:PutObject` only for
`arn:aws:s3:::<AWS_S3_BUCKET>/<AWS_S3_IMAGE_PREFIX>/*`. When KMS is enabled it
also needs the key permissions required to encrypt objects, normally
`kms:Encrypt` and `kms:GenerateDataKey` under the key policy.

## Request

```http
POST /api/internal/images
x-admin-api-key: <PRODUCT_WRITE_API_KEY>
Content-Type: image/webp
x-file-name: producto.webp

<raw image bytes>
```

Example:

```bash
curl --request POST http://localhost:3000/api/internal/images \
  --header "x-admin-api-key: $PRODUCT_WRITE_API_KEY" \
  --header "Content-Type: image/webp" \
  --header "x-file-name: producto.webp" \
  --data-binary @producto.webp
```

## Response

```json
{
  "image": {
    "key": "images/products/2026/07/uuid.webp",
    "url": "https://cdn.example.com/images/products/2026/07/uuid.webp",
    "contentType": "image/webp",
    "size": 48231,
    "checksumSha256": "hexadecimal-sha256"
  }
}
```

The returned URL is not attached to a Product automatically. Product association
must additionally supply approved alternative text, gallery position, Primary
status, and Product ownership through a separate API contract.
