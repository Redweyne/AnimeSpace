{
  "name": "Comment",
  "type": "object",
  "properties": {
    "moment_id": {
      "type": "string",
      "description": "ID of the anime moment this comment belongs to"
    },
    "content": {
      "type": "string",
      "description": "Comment text"
    },
    "likes": {
      "type": "array",
      "description": "Array of user emails who liked this comment",
      "items": {
        "type": "string"
      },
      "default": []
    }
  },
  "required": [
    "moment_id",
    "content"
  ]
}