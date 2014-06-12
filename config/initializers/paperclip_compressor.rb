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
       success = Paperclip.run('optipng', cmd)
      rescue PaperclipCommandLineError
        raise PaperclipError, "There was an error processing the preview for #{@basename}" if whiny
      end
    end
  end
end