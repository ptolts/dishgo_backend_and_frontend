# RACKSPACE_CONFIG = {
#   'production' => {
#     path: '',
#     storage: :fog,
#     fog_credentials: {
#       provider: 'Rackspace',
#       rackspace_username: "ptolts",
#       rackspace_api_key: "e9ba2a6e93591ce985a47ffada9d02d5",
#       rackspace_region: :iad,
#       persistent: false
#     },
#     fog_directory: 'Images',
#     fog_public: true
#   },
#   'development' => {
#     path: '',
#     storage: :fog,
#     fog_credentials: {
#       provider: 'Rackspace',
#       rackspace_username: 'ptolts',
#       rackspace_api_key: 'e9ba2a6e93591ce985a47ffada9d02d5',
#       rackspace_region: :iad,
#       persistent: false
#     },
#     fog_directory: 'Images',
#     fog_public: true
#   }
# }
 
# Paperclip::Attachment.default_options.update(RACKSPACE_CONFIG[Rails.env])
