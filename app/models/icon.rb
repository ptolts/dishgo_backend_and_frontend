#encoding: UTF-8

class Icon
  include Mongoid::Document
  include Mongoid::Paperclip
  store_in collection: "Icon", database: "osm"
  field :url, type: String
  belongs_to :individual_option, index: true
  belongs_to :restaurant

  has_mongoid_attached_file :img, {
      :path           => ':hash_:style.png',
      :hash_secret => "we_like_food",
      :styles => {
        :original => ['1000x1000>', :png],
        :icon    => ['100x100>',   :png]
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
    return {_id: self._id, local_file: self.img.url(:icon)}
  end

end

