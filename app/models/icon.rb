#encoding: UTF-8

class Icon
  include Mongoid::Document
  include Mongoid::Paperclip
  store_in collection: "Icon", database: "dishgo"
  field :url, type: String
  field :img_url_icon, type: String
  field :img_url_original, type: String
  field :height, type: Integer
  field :width, type: Integer

  belongs_to :individual_option, index: true
  belongs_to :restaurant, index: true

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
  after_post_process :img_post_process

  def serializable_hash options
    # This is for legacy images which didn't have their URL's saved.
    if self.img_url_icon.nil?
      img_post_process
    end   
    return {_id: self._id, local_file: self.img_url_icon}
  end

  def img_post_process
    self.img_url_icon = img.url(:icon) 
    self.img_url_original = img.url(:original) 
    tempfile = img.queued_for_write[:original]
    unless tempfile.nil?
      geometry = Paperclip::Geometry.from_file(tempfile)
      self.manual_img_fingerprint = Digest::MD5.hexdigest(File.open(tempfile.path).read)
      self.width = geometry.width.to_i
      self.height = geometry.height.to_i
      self.img_file_size = tempfile.size
    end
  end

  def set_coordinates coords
    @coordinates = coords
  end

  def get_coordinates 
    @coordinates
  end  

  def cropping?
    !@coordinates.nil?
  end

  def image_geometry(style = :original)
    @geometry ||= {}
    path = (img.options[:storage]==:fog) ? img.url(style) : img.path(style)
    @geometry[style] ||= Paperclip::Geometry.from_file(path)
  end

  # private
  def reprocess_img
    img.reprocess!
    img_post_process 
  end  

end

