{
  "name": "AnimeMoment",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Title of the anime moment"
    },
    "anime_name": {
      "type": "string",
      "description": "Name of the anime"
    },
    "episode": {
      "type": "string",
      "description": "Episode number or arc"
    },
    "description": {
      "type": "string",
      "description": "Description of why this moment is special"
    },
    "image_url": {
      "type": "string",
      "description": "Screenshot or image of the moment"
    },
    "likes": {
      "type": "array",
      "description": "Array of user emails who liked this moment",
      "items": {
        "type": "string"
      },
      "default": []
    },
    "tags": {
      "type": "array",
      "description": "Tags for the moment",
      "items": {
        "type": "string"
      },
      "default": []
    }
  },
  "required": [
    "title",
    "anime_name",
    "description"
  ]
}