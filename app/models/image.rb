#encoding: UTF-8

class Image
  include Mongoid::Document
  include Mongoid::Paperclip
  store_in collection: "image", database: "osm"
  field :local_file, type: String
  field :original_url, type: String
  field :tags, type: Array
  field :original_json, type: String
  field :description, type: String
  field :likes, type: Integer
  field :source, type: String
  field :position, type: Integer
  field :rejected, type: Boolean

  field :text_found, type: String
  field :local_file_face, type: String

  belongs_to :restaurant, index: true
  # belongs_to :dish, index: true

  has_mongoid_attached_file :img, {
      :path           => ':id/:filename_:style.:extension',
      :styles => {
        :original => ['1000x1000>', :png],
        :small    => ['100x',   :png],
        :medium   => ['320x',    :png],
        :large    => ['1024x',   :png]
      },
      storage: :fog,
      fog_credentials: {
        provider: 'Rackspace',
        rackspace_username: 'ptolts',
        rackspace_api_key: 'e9ba2a6e93591ce985a47ffada9d02d5',
        rackspace_region: :iad,
        persistent: false
      },
      fog_directory: 'Images',
      fog_public: true,
      fog_host: "https://36ec5e865094a74ec4cb-2d8ae1874a396bdb82dfc36ab7e38695.r97.cf5.rackcdn.com"
    }

  validates_attachment_content_type :img, :content_type => %w(image/jpeg image/jpg image/png), :message => 'file type is not allowed (only jpeg/png/gif images)'      

end
