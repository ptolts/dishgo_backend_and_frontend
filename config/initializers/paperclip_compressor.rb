module Paperclip
  class Compressor < Processor
    def initialize(file, options = {}, attachment = nil)
      super
      @file = file
      @path = @file.path
    end
    def make
      convert @path
      dst = File.open @path
    end
    def convert infile
      cmd = "#{infile}"
      begin
       success = Paperclip.run('jpegoptim', cmd)
      rescue PaperclipCommandLineError
        raise PaperclipError, "There was an error processing the preview for #{@basename}" if whiny
      end
    end
  end
end

module Paperclip
  class Converter < Processor
    def initialize(file, options = {}, attachment = nil)
      super
      @file           = file
      @path           = file.path
      @attachment     = attachment
      @size           = options[:res_ize]
      @current_format = File.extname(@file.path) 
      @format         = options[:format]
      @basename       = File.basename(@file.path, @current_format)
    end
    def make
      dst = Tempfile.new([@basename, @format ? ".#{@format}" : ''])
      dst_path = File.expand_path(dst.path)
      convert @path, dst_path
      File.open(dst_path)
    end
    def convert infile, outfile
      Rails.logger.warn `ls -al #{infile}`
      cmd = "'#{infile}' -resize '#{@size}' -strip -auto-orient '#{outfile}'"
      begin
       success = Paperclip.run('convert', cmd)
      rescue PaperclipCommandLineError
        raise PaperclipError, "There was an error processing the preview for #{@basename}" if whiny
      end
    end
  end
end