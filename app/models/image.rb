#encoding: UTF-8

class Image
  include Mongoid::Document
  include Mongoid::Paperclip
  include Mongoid::Timestamps

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
      :path           => ':hash_:style.png',
      :hash_secret => "we_like_food",
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
    }
  field :img_fingerprint, type: String
  field :manual_img_fingerprint, type: String
  validates_attachment_content_type :img, :content_type => %w(image/jpeg image/jpg image/png), :message => 'file type is not allowed (only jpeg/png/gif images)', :on => :create     


  def serializable_hash options
    if options[:ios]
      return super {}
    end

    if self.img_file_size
      return {_id: self._id, local_file: self.img.url(:medium), rejected: false}
    else
      return {_id: self._id, local_file: self.local_file, rejected: self.rejected}
    end
  end
end



